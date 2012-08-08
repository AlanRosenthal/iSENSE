// Generated by CoffeeScript 1.3.3

/*
 * Copyright (c) 2011, iSENSE Project. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials
 * provided with the distribution. Neither the name of the University of
 * Massachusetts Lowell nor the names of its contributors may be used to
 * endorse or promote products derived from this software without specific
 * prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 *
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.Bar = (function(_super) {

    __extends(Bar, _super);

    function Bar(canvas) {
      this.canvas = canvas;
    }

    Bar.prototype.ANALYSISTYPE_MAX = 0;

    Bar.prototype.ANALYSISTYPE_MIN = 1;

    Bar.prototype.ANALYSISTYPE_MEAN = 2;

    Bar.prototype.ANALYSISTYPE_MEDIAN = 3;

    Bar.prototype.analysisType = 0;

    Bar.prototype.sortField = data.normalFields[0];

    Bar.prototype.buildOptions = function() {
      Bar.__super__.buildOptions.call(this);
      this.chartOptions;
      return $.extend(true, this.chartOptions, {
        chart: {
          type: "column"
        },
        title: {
          text: "Bar"
        },
        legend: {
          symbolWidth: 0
        },
        tooltip: {
          formatter: function() {
            var str;
            console.log(this);
            str = "<div style='width:100%;text-align:center;color:" + this.series.color + ";'> " + this.series.name.group + "</div><br>";
            str += "<table>";
            str += "<tr><td>" + this.series.xAxis.options.title.text + ":</td><td><strong>" + this.x + "</strong></td></tr>";
            str += "<tr><td>" + this.series.name.field + ":</td><td><strong>" + this.y + "</strong></td></tr>";
            return str += "</table>";
          },
          useHTML: true
        }
        /*
                    xAxis:
                        categories:
                            for fieldIndex in data.normalFields when (fieldIndex in globals.fieldSelection)
                                data.fields[fieldIndex].fieldName
                
                    #if (groupIndex in globals.groupSelection) and (fieldIndex in globals.fieldSelection)
                
                    for fieldIndex, categoryIndex in data.normalFields
                        for groupName, groupIndex in data.groups when ((groupIndex in globals.groupSelection) and (fieldIndex in globals.fieldSelection))
                            options =
                                data: [
                                    x: categoryIndex
                                    y: data.getMax fieldIndex, groupIndex
                                    ]
                                showInLegend: false
                                color: globals.colors[groupIndex % globals.colors.length]
                                name: data.groups[groupIndex] + data.fields[fieldIndex].fieldName
                            @chartOptions.series.push options
        */

      });
    };

    Bar.prototype.update = function() {
      var fieldIndex, groupIndex, groupName, options, selection, visibleCategories, _i, _len, _ref;
      Bar.__super__.update.call(this);
      visibleCategories = (function() {
        var _i, _len, _ref, _results;
        _ref = data.normalFields;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          selection = _ref[_i];
          if (__indexOf.call(globals.fieldSelection, selection) >= 0) {
            _results.push(data.fields[selection].fieldName);
          }
        }
        return _results;
      })();
      this.chart.xAxis[0].setCategories(visibleCategories, false);
      while (this.chart.series.length > data.normalFields.length) {
        this.chart.series[this.chart.series.length - 1].remove(false);
      }
      /*
              categoryIndex = -1
              for fieldIndex in data.normalFields when fieldIndex in globals.fieldSelection
                  categoryIndex += 1
                  
                  for groupName, groupIndex in data.groups when groupIndex in globals.groupSelection
                      options =
                          data: [
                              x: categoryIndex
                              y: data.getMax fieldIndex, groupIndex
                              ]
                          showInLegend: false
                          color: globals.colors[groupIndex % globals.colors.length]
                          name: data.groups[groupIndex] + data.fields[fieldIndex].fieldName
                          
                      @chart.addSeries options, false
      */

      _ref = data.groups;
      for (groupIndex = _i = 0, _len = _ref.length; _i < _len; groupIndex = ++_i) {
        groupName = _ref[groupIndex];
        if (!(__indexOf.call(globals.groupSelection, groupIndex) >= 0)) {
          continue;
        }
        options = {
          showInLegend: false,
          color: globals.colors[groupIndex % globals.colors.length],
          name: data.groups[groupIndex]
        };
        options.data = (function() {
          var _j, _len1, _ref1, _results;
          _ref1 = data.normalFields;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            fieldIndex = _ref1[_j];
            if (__indexOf.call(globals.fieldSelection, fieldIndex) >= 0) {
              switch (this.analysisType) {
                case this.ANALYSISTYPE_MAX:
                  _results.push(data.getMax(fieldIndex, groupIndex));
                  break;
                case this.ANALYSISTYPE_MIN:
                  _results.push(data.getMin(fieldIndex, groupIndex));
                  break;
                case this.ANALYSISTYPE_MEAN:
                  _results.push(data.getMean(fieldIndex, groupIndex));
                  break;
                case this.ANALYSISTYPE_MEDIAN:
                  _results.push(data.getMedian(fieldIndex, groupIndex));
                  break;
                default:
                  _results.push(void 0);
              }
            }
          }
          return _results;
        }).call(this);
        this.chart.addSeries(options, false);
      }
      return this.chart.redraw();
    };

    Bar.prototype.buildLegendSeries = function() {
      var count, dummy, field, fieldIndex, _i, _len, _ref, _results;
      count = -1;
      _ref = data.fields;
      _results = [];
      for (fieldIndex = _i = 0, _len = _ref.length; _i < _len; fieldIndex = ++_i) {
        field = _ref[fieldIndex];
        if (!(__indexOf.call(data.normalFields, fieldIndex) >= 0)) {
          continue;
        }
        count += 1;
        _results.push(dummy = {
          data: [],
          color: '#000',
          visible: __indexOf.call(globals.fieldSelection, fieldIndex) >= 0 ? true : false,
          name: field.fieldName,
          type: 'area',
          xAxis: 1
        });
      }
      return _results;
    };

    Bar.prototype.drawAnalysisTypeControls = function() {
      var controls, fieldID, type, typestring, _i, _j, _len, _len1, _ref, _ref1, _ref2,
        _this = this;
      controls = '<div id="AnalysisTypeControl" class="vis_controls">';
      controls += '<table class="vis_control_table"><tr><td class="vis_control_table_title">Analysis Type:</td></tr>';
      _ref = [[this.ANALYSISTYPE_MAX, 'Max'], [this.ANALYSISTYPE_MIN, 'Min'], [this.ANALYSISTYPE_MEAN, 'Mean'], [this.ANALYSISTYPE_MEDIAN, 'Median']];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], type = _ref1[0], typestring = _ref1[1];
        controls += '<tr><td><div class="vis_control_table_div">';
        controls += "<input class='analysisType' type='radio' name='analysisTypeSelector' value='" + type + "' " + (type === this.analysisType ? 'checked' : '') + "> " + typestring + "</input><br>";
        controls += '</div></td></tr>';
      }
      /* ---
      */

      controls += '<tr><td><div class="vis_control_table_div"><br>';
      controls += 'Sort by: <select class="sortField">';
      _ref2 = data.normalFields;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        fieldID = _ref2[_j];
        controls += "<option value='" + fieldID + "'" + (this.sortField === fieldID ? ' selected' : '') + ">" + data.fields[fieldID].fieldName + "</option>";
      }
      controls += '</select>';
      controls += '</div></td></tr>';
      controls += '</table></div>';
      /* ---
      */

      ($('#controldiv')).append(controls);
      ($('.analysisType')).change(function(e) {
        _this.analysisType = Number(e.target.value);
        return _this.delayedUpdate();
      });
      return ($('.sortField')).change(function(e) {
        _this.sortField = Number(e.target.value);
        console.log(_this.sortField);
        return _this.delayedUpdate();
      });
    };

    Bar.prototype.drawControls = function() {
      this.drawGroupControls();
      return this.drawAnalysisTypeControls();
    };

    return Bar;

  })(BaseVis);

  globals.bar = new Bar('bar_canvas');

}).call(this);
