openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Controller = Marionette.Controller,
        _super = Controller.prototype;

    var graph = null, call = 0;
    
    var defaults = {
        general : {
            group: false,
            HtmlText : false,
            mouse: {
                sensibility: 30,
                track: true,
                position: 'ne',
                lineColor: '#333333',
                trackFormatter: function(item){
                    if(graph && graph.trackFormatter){
                        return graph.trackFormatter(item);
                    }
                    return item.x + ', ' + item.y;
                },
            },
            legend : {
              backgroundColor : '#ffffff',
              labelBoxBorderColor: '#ffffff',
              customBoxBorderColor: '#cacaca'
            },
            xaxis: {
                tickFormatter:  function(tick){
                    if(graph && graph.tickFormatter){
                        return graph.tickFormatter(tick);
                    }
                    return tick;
                },
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
                this.ticks_group = this.total + 1;    
            }    
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
                var name = result.get(x_axis.get('sql_name')) || dashboard.web()._t('undefined'),
                    x = this.getTickIndex(name, index, x_axis),
                    y = parseInt(result.get(y_axis.get('sql_name')));
                
                data.push([x, y]);
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
        
        getTickIndex: function(name, index, x_axis){
            var current_serie = this.series.length - 1,
                last_tick = _(this.ticks).last(),
                tick = _(this.ticks).find(function(tick){ 
                    return x_axis.unformat(tick[0]) == name; 
                });
        
            if(!tick){
                if(x_axis.type() != 'string' && last_tick && $.isNumeric(name)){
                    var next_value = x_axis.nextIndex(x_axis.unformat(last_tick[0])),
                        value = parseInt(name);
                    
                    while(next_value != value){
                        this.ticks.push([x_axis.format(next_value), this.ticks.length * this.ticks_group]);
                        next_value = x_axis.nextIndex(next_value);
                    }
                }
                tick = [x_axis.format(name), this.ticks.length * this.ticks_group];
                this.ticks.push(tick);
            }
        
            return tick[1] + (this.options.group ? current_serie : 0);
        },
        
        getTick: function(index){
            index = parseInt(index);
            var group = this.ticks_group;
            return _(this.ticks).find(function(tick){ 
                return tick[1] <= index && index < tick[1] + group; 
            });
        },
        
        getTicks: function(){
            // reorder ticks
            
            if(this.search){
                var _ticks = _(this.ticks),
                    order = this.search.get('order'),
                    serie = _(this.series).last();
                
                // force ordering by x_axis if no order are selected
                order = order.length > 0 ? order : (serie ? [{ field: serie.x_axis, type: 'ASC' }] : []);
            
                if(order.length > 0 && serie.x_axis.type() == 'string' && serie.x_axis.compatible(order[0].field)){
                    this.ticks = _ticks.sortBy(function(tick){
                        return tick[0];
                    });
                }
                
                if(order.type == 'DESC'){
                    this.ticks.reverse();
                }
            }
            
            // recreate all ticks based on group required 
            
            var group = this.ticks_group,
                half = Math.floor(group / 2),
                ticks = [];
            
            _(this.ticks).each(function(tick){
                var index = tick[1], value = tick[0];
                for(var i=0 ; i<group ; i++){
                    ticks.push([ index + i, (i == half ? value : '') ]);
                }
            });
            
            return ticks;
        },
        
        trackFormatter: function(item){
            
            var tick = this.getTick(item.x);
                label = tick && tick[0] ? tick[0] : item.x;
            
            
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