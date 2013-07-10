openerp.trobz.module('trobz_dashboard', function(dashboard, _, Backbone, base){
    
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Formatter = function(options){
        options = options || {}
        _.defaults(options, {
            pattern: /(.*)/,
            input: '',
            output: '[value]',
            suffix: null,
            range: {}
        });
     
        this.data = [];
        this.options = options;   
        this.process(options.range);
    };
    
    Formatter.prototype = {
        
        process: function(range){
            if($.isPlainObject(range) && range.from && range.to){
                for(; range.from <= range.to ; range.from++){
                    this.data.push(numeral(range.from).format('0o'));
                }
            }
        },
        
        index: function(value){
            var date = moment(value, this.options.output),
                index = null;
            if(date.isValid()){
                index = date.format(this.options.input);
            }
            else if(this.data.length > 0){
                index = this.data.indexOf(value) + 1;
            }
            else {
                index = value;
            }
            return this.unhumanize(index, value);
        },
        
        value: function(index){
            var date = moment(index, this.options.input),
                value = null;
                
            if(date.isValid() && parse.length >= 1){
                value = date.format(this.options.output);
            }
            else if(this.data.length >= index){
                value = this.data[index - 1];
            }
            else {
                value = index;
            }
        
            return this.humanize(index, value);
        },
        
        humanize: function(index, value){
            if(this.options.suffix){
                var match = this.options.pattern.exec(index),
                    data_index = match.length >= 2 ? parseInt(match[1]) : null;
             
                if(data_index && this.data.length < data_index){
                    value = value.replace(/\[value\]/, numeral(this.data[data_index - 1]).format('0o'))
                                 .replace(/\[suffix\]/, this.options.suffix);
                }
            }
            return value;
        },
        
        unhumanize: function(index, value){
            if(this.options.suffix){
                var match = this.options.pattern.exec(index),
                    data_value = match.length >= 2 ? match[1] : null;
             
                if(data_index && this.data.length < data_index){
                    index = index.replace(/\[value\]/, this.data.indexOf(data_value));
                }
            }
            return index;
        },
        
        nextIndex: function(index){
            var match = this.options.pattern.exec(index),
                data_value = match.length >= 2 ? parseInt(match[1]) : null;
            return $.isNumeric(data_value) 
                         ? this.data.length > 0 
                            ? data_value + 1 >= this.data.length + 1 
                               ? 0 
                               : data_value + 1
                            : data_value + 1
                         : index
        },
    };
    
    var formatter = {
        'string': new Formatter(),
        'year': new Formatter(),
        'quarter': new Formatter({
            input: 'YYYY [value]',
            output: '[value] [suffix], YYYY',
            pattern: /([0-9]+[rndsth]*)( [a-z])?$/i,
            suffix: 'quarter',
            range: {from: 1, to: 4}
         }),
        'month': new Formatter({
            input: 'YYYY-MM',
            output: 'MMMM YYYY'
         }),
        'week': new Formatter({
            input: 'YYYY [value]',
            output: '[value] [suffix], YYYY',
            pattern: /([0-9]+[rndsth]*)( [a-z])?$/i,
            suffix: 'week',
            range: {from:1, to: 52}
         }),
        'day': new Formatter({
            input: 'YYYY-MM-DD',
            output: 'YYYY-MM-DD'
         })
    };
    
    
    
    var Field = BaseModel.extend({
        
        compatible: function(field){
            return this.has('reference') && this.get('reference') == field.get('reference');
        },
        
        /*
         * used for date special type 
         */
        type: function(){
            if(!this._type){
                var desc = this.get('field_description'),
                type = $.isPlainObject(desc) ? desc.type : 'string';
            
                if(/date/.test(type)){
                    var sql_name = this.get('sql_name');
                    type = _(['year', 'quarter', 'month', 'week', 'day']).find(function(t){
                        var re = new RegExp('^extract\(.*' + t + '.*\)', 'i');
                        return re.test(sql_name);    
                    }) || 'string';
                }
                else {
                    type = 'string';
                }
                this._type = type;    
            }
            
            return this._type;
        },
        
        formatter: function(){
            if(!this._formatter){
                var type = this.type();
                this._formatter = type in formatter ? formatter[type] : null;
            }
            return this._formatter;
        },
        
        format: function(name){
            var data = this.extractIndex(name);
            return data.prefix + this.formatter().value(index);
        },
        
        unformat: function(name){
            var value = this.extractValue(name);
            return data.prefix + this.formatter().index(value);
        },
        
        nextIndex: function(index){
            return this.formatter().nextIndex(index);
        },
        
        extractIndex: function(name){
            var data = this.formatter().extract(name);
            if(!data.value){
                throw new Error('can not found the value to extract from x axis entry: "' + name + '"');
            }
            return data; 
        }
    });

    dashboard.models('Field', Field);
});