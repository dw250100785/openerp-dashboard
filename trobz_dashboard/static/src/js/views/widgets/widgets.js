openerp.trobz.module('trobz_dashboard',function(dashboard, _, Backbone, base){
 
    var Widget = dashboard.views('Widget'),
        View = Marionette.CollectionView,
        _super = View.prototype;

    var WidgetsView = View.extend({
        
        type: 'list',
        
        className: 'list',
        
        itemView: Widget,
        
        itemViewOptions: function(model, index) {
            return {
                period: this.period,
                debug: this.debug,
                global_search: this.global_search
            };
        },
        
        initialize: function(options){
            this.period = options.period;
            this.debug = options.debug;
            this.global_search = options.global_search;
        },
        
        animate: function(duration){
            duration = duration || 10000;
            this.stopAnimate();
            if(this.type == 'sliding'){
                this.timer = setInterval($.proxy(this.slide, this), duration);        
            }
        },
        
        stopAnimate: function(){
            clearInterval(this.timer || 0);
        },
        
        slide: function(){
            var x = parseInt(this.$el.css('x')),
                last = - (this.size.width * (this.collection.length - 2)),
                next = x + this.size.width > last ? x - this.size.width : 0;
            
            this.$el.transition({
                x: next,
                y: 0
            }, 2000)
        },
        
        mode: function(type){
            this.type = type;
            
            this.$el.attr({
                'class': type, 
                style: ''
            });
            
            this.render();
            
            if(type == 'sliding'){
                var size = this.size = {
                    width: this.$el.width(),
                    height: this.$el.height()
                };
                
                this.children.each(function(widget, index){
                    widget.width = widget.$el.width(); 
                    widget.$el.css({
                        width: size.width,
                        left: size.width * index
                    });
                });
                
                this.$el.css({
                    height: $(window).outerHeight() - this.$el.offset().top,
                    x: 0,
                    y: 0
                });
            }
            else {
                this.children.each(function(widget){
                    widget.$el.attr({
                        style: ''   
                    });
                });
                
                this.$el.attr({
                    style: ''   
                });
            }
        }
        
    });

    dashboard.views('Widgets', WidgetsView);

});