openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){

    var Controller = Marionette.Controller,
        _super = Controller.prototype;

    var RenderGraph = Controller.extend({
        
        initialize: function(options){
            this.$el = $('<div class="graph">');
            this.data = [];
            this.options = {};
            this.series = [];
        },
        
        setElement: function($el){
            this.$dest = $el;
        },
        
        getElement: function(){
            return this.$el.get(0);
        },
        
        appendGraph: function(){
            this.$dest.append(this.$el);
        },
        
        addData: function(metric, x_axis, y_axis, options){
            if(metric.results.length > 0 && x_axis && y_axis){
                this.convert(metric, x_axis, y_axis, options);    
            }
        },
        
        render: function(){
            if(this.data.length > 0){
                this.appendGraph();
                this.resize();
               
                console.log('RenderGraph', 'render', this.data, this.options);
                Flotr.draw(this.getElement(), this.data, this.options);

                this.reset();
            }
        },
        
        convert: function(metric, x_axis, y_axis, options){
            var add_y_axis = this.checkPreviousSeries(x_axis, y_axis),
                moreOptions = {};
            
            this.series.push({ x_axis: x_axis, y_axis: y_axis });
            
            var data = [], xticks = [], y_min = null, y_max = null;
        
            metric.results.each(function(result, index){
                var x = index,
                    y = parseInt(result.get(y_axis.get('sql_name')));
                y_min = !y_min ? y : (y_min > y ? y : y_min);
                y_max = !y_max ? y : (y_max < y ? y : y_max);
                
                xticks.push([ index, ( result.get(x_axis.get('sql_name')) || dashboard.web()._t('undefined') ) ]);    
                data.push([index, y])
            });
            
            this.data.push(
                _.extend({ data: data, label: metric.get('name'), yaxis : (add_y_axis ? 2 : 1) }, this.serieOptions(options))
            );
            
            if(add_y_axis){
                moreOptions = {
                    y2axis: {
                        min: 0,
                        title: y_axis.get('name')
                    }   
                };
            }
            else {
                moreOptions = {
                    yaxis: {
                        min: 0,
                        title: y_axis.get('name')
                    }
                };
            }
            
            _.extend(this.options, {
                HtmlText : false,
                legend : {
                  backgroundColor : '#ffffff'  
                },
                xaxis: {
                    ticks: xticks,
                    labelsAngle : 45,
                    title : x_axis.get('name')
                },
                grid: {
                    offset: {
                        left: 50,
                        right: 50,
                        top: 50
                    }
                }
            }, moreOptions);
        },
        
        serieOptions: function(options){
            switch(options.type || 'bar') {
                case 'pie':
                    _.extend(options, { pie : { show : true } })       
                    break;
                case 'line':
                    _.extend(options, { lines : { show : true } })       
                    break;
                case 'bar':
                default:
                    _.extend(options, {
                        bars : {
                            show : true,
                            horizontal : false,
                            shadowSize : 0,
                            barWidth : 0.8,
                            centered: true, 
                        }
                    })       
                    break;
            }
            return options;
        },
        
        checkPreviousSeries: function(x_axis, y_axis){
            var y_diff = 0;
            _(this.series).each(function(serie){
                if(serie.x_axis.get('reference') != x_axis.get('reference')){
                    throw new Error('a previous serie with x-axis: "' + serie.x_axis.get('reference') + '" is not compatible with x-axis: "' + x_axis.get('reference') + '"');
                }    
                if(serie.y_axis.get('reference') != y_axis.get('reference')){
                    if(++y_diff >= 2){
                        throw new Error('currently only 2 differents y_axis are supported, more have been detected');
                    }
                }
            });
            
            
            return this.series.length > 0 && this.series[this.series.length-1].y_axis.get('reference') != y_axis.get('reference');
        },
        
        reset: function(){
            this.series = [];
            this.data = [];
            this.options = {};
        },
        
        resize: function(){
            //preserve a 4/3 ratio
            var width = this.$el.parent().width() - 100, height = width / (16/9);
            this.$el.css({
                width: width,
                height: height
            });
        }
    });

    var call = 0;

    var graph = new RenderGraph();

    var DisplayGraph = Controller.extend({

        initialize: function(options){
            this.model = options.model;
            this.collectionView = options.collectionView;
        },

        render: function(){
            var results = this.model.results, 
                x_axis = results.columns[0] || null,
                y_axis = results.columns[1] || null;
            
            graph.addData(this.model, x_axis, y_axis, this.model.get('options'));
            
            // check if all metrics have been initialized, then render the graph
            if(++call >= this.model.collection.length){
                graph.setElement(this.collectionView.$el);
                graph.render();
                call = 0;
            }
        }
    });

    dashboard.views('DisplayGraph', DisplayGraph);
});