openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Controller = Marionette.Controller,
        _super = Controller.prototype;

    var graph = null, call = 0;
    
    var defaults = {
        general: {
            group: false,
            HtmlText : false,
            mouse: {
                sensibility: 30,
                track: true,
                position: 'ne',
                lineColor: '#333333',
            },
            legend : {
              backgroundColor : '#ffffff',
              labelBoxBorderColor: '#ffffff',
              customBoxBorderColor: '#cacaca'
            },
            xaxis: {
                labelsAngle : 45
            },
            grid: {
                labelMargin: 5
            }    
        },
        
        bar: {
            bars: {
                show : true,
                horizontal : false,
                shadowSize : 0,
                centered: true, 
            }
        },
        
        line: {
            lines: { show : true }
        },
        
        pie: {
            pie: { show : true }
        }
    };

    var GraphRenderer = Controller.extend({
        
        initialize: function(options){
            this.series = [];
            this.data = [];
            this.ticks = [];
            this.ticks_group = 1; //nb of item in 1 tick groups
            
            this.rendered = false;
            
            this.metrics = options.metrics;
            this.options = _.extend(options.general, defaults.general);
            this.search = options.search;
            this.total = options.metrics.length;
            this.call = 0;
            
            this.setup();
            this.setElement(options.$el);
        },
        
        setup: function(){
            this.options.group = this.metrics.every(function(metric){ 
                var options = metric.get('options');
                return 'type' in options && options.type == 'bar'
            });
            
            if(this.options.group){
                this.ticks_group = this.total + (this.total > 1 ? 1 : 0);    
            }
            
            this.options.mouse.trackFormatter = $.proxy(this.trackFormatter, this);   
        },
        
        render: function(){
            if(this.data.length > 0){
                this.options.xaxis.ticks = this.getTicks(); 
                
                this.appendHtml();
                this.resize();
                
                console.log('RenderGraph', 'render', this.data, this.options);
                if(this.$el.is(':visible')){
                    Flotr.draw(this.$el.get(0), this.data, this.options);    
                }
            }
            this.rendered = true;
        },
        
        addData: function(metric, x_axis, y_axis, options){
            if(x_axis && y_axis && this.series.length < this.total){
                this.convert(metric, x_axis, y_axis, options);    
            }
            else if(metric.results.length == 0){
                //add empty data for metric without results
                this.data.push({
                    data: [],
                    label: metric.get('name')
                })
            }
            if(++this.call == this.total){
                this.render();
            }
        },
        
        convert: function(metric, x_axis, y_axis, options){
            var add_y_axis = this.checkPreviousSeries(x_axis, y_axis),
                data = [];
            
            this.series.push({ x_axis: x_axis, y_axis: y_axis });
        
            metric.results.each(function(result, index){
                var name = result.get(x_axis.get('reference')) || dashboard.web()._t('undefined'),
                    x = this.getTickIndex(name, x_axis),
                    y = result.get(y_axis.get('reference'));
                
                if($.isNumeric(y)){
                    data.push([x, parseInt(y)]);    
                }
            }, this);
            
            this.data.push(
                _.extend({ 
                    data: data, 
                    label: metric.get('name'), 
                    yaxis : (add_y_axis ? 2 : 1) 
               }, this.serieOptions(options))
            );
            
            var yaxis = add_y_axis ? 'y2axis' : 'yaxis';
            this.options.xaxis = _.extend({ title : x_axis.get('name'), min: 0 }, this.options.xaxis);
            if(!(yaxis in this.options)){
                this.options[yaxis] = { title: y_axis.get('name'), min: 0 }; 
            }
        },
    
        serieOptions: function(options){
            var type = 'type' in options ? options.type : 'bar';
            return _.extend(options, defaults[type]);
        },
        
        getTickIndex: function(name, x_axis){
            var current_serie = this.series.length - 1,
                tick = _(this.ticks).find(function(tick){ 
                    return tick.origin == name; 
                });
        
            if(!tick){
                tick = {
                    value: x_axis.format(name),
                    origin: name,
                    index: this.ticks.length * this.ticks_group
                };
                this.ticks.push(tick);
            }
        
            return tick.index + (this.options.group ? current_serie : 0);
        },
        
        getTick: function(index){
            index = parseInt(index);
            var group = this.ticks_group;
            return _(this.ticks).find(function(tick){ 
                return tick.index <= index && index < tick.index + group; 
            });
        },
        
        getTicks: function(){
            // recreate all ticks based on group required 
            
            var group = this.ticks_group,
                half = Math.floor(group / 2),
                ticks = [];
            
            _(this.ticks).each(function(tick){
                var index = tick.index, value = tick.value;
                for(var i=0 ; i < group ; i++){
                    ticks.push([ index + i, (i == half ? value : '') ]);
                }
            });
            
            return ticks;
        },
        
        trackFormatter: function(item){
            
            var tick = this.getTick(item.x);
                label = tick && tick.value ? tick.value : item.x;
            
            
            return label + ': ' + item.y;
        },
        
        checkPreviousSeries: function(x_axis, y_axis){
            var y_diff = 0, 
                last_serie = _(this.series).last();
            
            _(this.series).each(function(serie){
                var serie_x_ref = serie.x_axis.get('reference'), serie_y_ref = serie.y_axis.get('reference'),
                    x_ref = x_axis.get('reference'), y_ref = y_axis.get('reference');
               
                if(serie_x_ref != x_ref){
                    throw new Error('a previous serie with x-axis: "' + serie_x_ref + '" is not compatible with x-axis: "' + x_ref + '"');
                }    
                if(serie_y_ref != y_ref){
                    if(++y_diff >= 2){
                        throw new Error('currently only 2 differents y_axis are supported, more have been detected');
                    }
                }
            });
            return last_serie && !last_serie.y_axis.compatible(y_axis);
        },
        
        setElement: function($el){
            this.$dest = $el;
            this.$el = $('<div class="graph">');
        },
        
        appendHtml: function(){
            this.$dest.empty();
            this.$dest.html(this.$el);
        },
        
        resize: function(){
            //preserve a 4/3 ratio
            var el_width = this.$el.parent().width(),
                margin = Math.round(el_width / 10), 
                width = el_width - margin, 
                height = width / (16/9);
                
            this.$el.css({
                width: width,
                height: height
            });
        }
    });

    var DisplayGraph = Controller.extend({

        initialize: function(options){
            this.model = options.model;

            //create the graph object, at the first metric init
            if(!graph || graph.rendered){
                graph = new GraphRenderer({
                    search: options.search,
                    metrics: options.model.collection,
                    $el: options.collectionView.$el,
                    general: {}
                });
            }            
        },

        render: function(){
            var results = this.model.results, 
                x_axis = results.columns[0] || null,
                y_axis = results.columns[1] || null,
                options = _(this.model.get('options')).clone();
            
            console.log('DisplayGraph render', options);
            
            graph.addData(this.model, x_axis, y_axis, options);
        }
    });

    dashboard.views('DisplayGraph', DisplayGraph);
});