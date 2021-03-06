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
  var keys, vals, _ref, _ref1, _ref2, _ref3,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.globals) == null) {
    window.globals = {};
  }

  if ((_ref1 = globals.logY) == null) {
    globals.logY = 0;
  }

  if (!(data.savedGlobals != null)) {
    if ((_ref2 = globals.groupSelection) == null) {
      globals.groupSelection = (function() {
        var _i, _len, _ref3, _results;
        _ref3 = data.groups;
        _results = [];
        for (keys = _i = 0, _len = _ref3.length; _i < _len; keys = ++_i) {
          vals = _ref3[keys];
          _results.push(Number(keys));
        }
        return _results;
      })();
    }
    if ((_ref3 = globals.fieldSelection) == null) {
      globals.fieldSelection = data.normalFields.slice(0, 1);
    }
  }

  window.BaseVis = (function() {

    function BaseVis(canvas) {
      this.canvas = canvas;
    }

    /*
        Start sequence used by runtime
    */


    BaseVis.prototype.start = function() {
      this.drawControls();
      return this.update();
    };

    /*
        Update minor state
            Redraws html controls
    
            Derrived classes should overload to reload content.
    */


    BaseVis.prototype.update = function() {};

    /*
        Default delayed update simply updates
    */


    BaseVis.prototype.delayedUpdate = function() {
      return this.update();
    };

    /*
        Method called when vis resize has begun
            Defaults to doing nothing.
    */


    BaseVis.prototype.resize = function(newWidth, newHeight) {};

    /*
        End sequence used by runtime
            This is called when the user switches away from this vis.
            Should destroy the chart, hide its canvas and remove controls.
    */


    BaseVis.prototype.end = function() {
      console.log(console.trace());
      return alert("BAD IMPLEMENTATION ALERT!\n\nCalled: 'BaseVis.end'\n\nSee logged stack trace in console.");
    };

    /*
        Draws controls
            Derived classes should write control HTML and bind handlers using the method such as drawGroupControls.
    */


    BaseVis.prototype.drawControls = function() {
      return this.clearControls();
    };

    /*
        Clear the controls
            Unbinds control handlers and clears the HTML elements.
    */


    BaseVis.prototype.clearControls = function() {
      return ($('#controldiv')).empty();
    };

    /*
        Draws group selection controls
            This includes a series of checkboxes and a selector for the grouping field.
            The checkbox text color should correspond to the graph color.
    */


    BaseVis.prototype.drawGroupControls = function(startOnGroup) {
      var controls, counter, fieldIndex, gIndex, group, sel, _i, _j, _len, _len1, _ref4, _ref5, _ref6, _ref7,
        _this = this;
      if (startOnGroup == null) {
        startOnGroup = false;
      }
      controls = '<div id="groupControl" class="vis_controls">';
      controls += "<h3 class='clean_shrink'><a href='#'>Groups:</a></h3>";
      controls += "<div class='outer_control_div'>";
      controls += '<div class="inner_control_div"> Group By: ';
      controls += '<select id="groupSelector" class="control_select">';
      _ref4 = data.textFields;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        fieldIndex = _ref4[_i];
        sel = fieldIndex === data.groupingFieldIndex ? 'selected' : '';
        controls += "<option value='" + (Number(fieldIndex)) + "' " + sel + ">" + data.fields[fieldIndex].fieldName + "</option>";
      }
      controls += "</select></div>";
      counter = 0;
      _ref5 = data.groups;
      for (gIndex = _j = 0, _len1 = _ref5.length; _j < _len1; gIndex = ++_j) {
        group = _ref5[gIndex];
        controls += "<div class='inner_control_div' style=\"color:" + globals.colors[counter % globals.colors.length] + ";\">";
        controls += "<input class='group_input' type='checkbox' value='" + gIndex + "' " + ((_ref6 = Number(gIndex), __indexOf.call(globals.groupSelection, _ref6) >= 0) ? "checked" : "") + "/>&nbsp";
        controls += "" + group;
        controls += "</div>";
        counter += 1;
      }
      controls += '</div></div>';
      ($('#controldiv')).append(controls);
      ($('#groupSelector')).change(function(e) {
        var element;
        element = e.target || e.srcElement;
        data.setGroupIndex(Number(element.value));
        globals.groupSelection = (function() {
          var _k, _len2, _ref7, _results;
          _ref7 = data.groups;
          _results = [];
          for (keys = _k = 0, _len2 = _ref7.length; _k < _len2; keys = ++_k) {
            vals = _ref7[keys];
            _results.push(Number(keys));
          }
          return _results;
        })();
        _this.delayedUpdate();
        return _this.drawControls();
      });
      ($('.group_input')).click(function(e) {
        var selection;
        selection = [];
        ($('.group_input')).each(function() {
          if (this.checked) {
            return selection.push(Number(this.value));
          } else {

          }
        });
        globals.groupSelection = selection;
        if (startOnGroup) {
          return _this.start();
        } else {
          return _this.delayedUpdate();
        }
      });
      if ((_ref7 = globals.groupOpen) == null) {
        globals.groupOpen = 0;
      }
      ($('#groupControl')).accordion({
        collapsible: true,
        active: globals.groupOpen
      });
      return ($('#groupControl > h3')).click(function() {
        return globals.groupOpen = (globals.groupOpen + 1) % 2;
      });
    };

    /*
        Draws vis saving controls
    */


    BaseVis.prototype.drawSaveControls = function(e) {
      var controls, _ref4,
        _this = this;
      controls = '<div id="saveControl" class="vis_controls">';
      controls += "<h3 class='clean_shrink'><a href='#'>Saving:</a></h3>";
      controls += "<div class='outer_control_div' style='text-align:center'>";
      controls += "<div class='inner_control_div'>";
      controls += "<button id='saveVisButton' class='save_button'>Save Visualization </button>";
      controls += "</div>";
      if (this.chart != null) {
        controls += "<div class='inner_control_div'>";
        controls += "<button id='downloadVisButton' class='save_button'> Download Visualization </button>";
        controls += "</div>";
        controls += "<div class='inner_control_div'>";
        controls += "<button id='printVisButton' class='save_button'> Print Visualization </button>";
        controls += "</div>";
      }
      controls += '</div></div>';
      ($('#controldiv')).append(controls);
      ($("#saveControl button")).button();
      ($("#saveVisButton")).click(function() {
        return globals.verifyUser((function() {
          return globals.savedVisDialog();
        }), (function() {
          return alert('You must be logged in to save a visualization.');
        }));
      });
      ($('#downloadVisButton')).click(function() {
        return _this.chart.exportChart({
          type: "image/svg+xml"
        });
      });
      ($('#printVisButton')).click(function() {
        return _this.chart.print();
      });
      if ((_ref4 = globals.saveOpen) == null) {
        globals.saveOpen = 0;
      }
      ($('#saveControl')).accordion({
        collapsible: true,
        active: globals.saveOpen
      });
      return ($('#saveControl > h3')).click(function() {
        return globals.saveOpen = (globals.saveOpen + 1) % 2;
      });
    };

    /*
        Hides the control div and remembers its previous size.
    */


    BaseVis.prototype.hideControls = function() {
      this.controlWidth = ($('#controldiv')).width();
      ($('#controldiv')).width(0);
      ($('#controlhider')).hide();
      return ($('#' + this.canvas)).css({
        width: ($("#viscontainer")).innerWidth() - (($("#controlhider")).outerWidth() + globals.VIS_MARGIN)
      });
    };

    /*
        Returns the control div with its previous size intact.
    */


    BaseVis.prototype.unhideControls = function() {
      ($('#controldiv')).width(this.controlWidth);
      return ($('#controlhider')).show();
    };

    /*
        Do any nessisary cleanup work before serialization.
    */


    BaseVis.prototype.serializationCleanup = function() {};

    return BaseVis;

  })();

  window.BaseHighVis = (function(_super) {

    __extends(BaseHighVis, _super);

    /*
        Constructor
            Assigns target canvas name
    */


    function BaseHighVis(canvas) {
      this.canvas = canvas;
    }

    /*
        Builds Highcharts options object
            Builds up the options common to all vis types.
            Subsequent derrived classes should use $.extend to expand upon these agter calling super()
    */


    BaseHighVis.prototype.buildOptions = function() {
      var self,
        _this = this;
      self = this;
      this.chartOptions = {
        chart: {
          renderTo: this.canvas,
          reflow: false
        },
        credits: {
          enabled: false
        },
        exporting: {
          buttons: {
            exportButton: {
              enabled: false
            },
            printButton: {
              enabled: false
            }
          }
        },
        legend: {
          symbolWidth: 60,
          itemWidth: 200
        },
        plotOptions: {
          series: {
            turboThreshold: Number.MAX_VALUE,
            marker: {
              lineWidth: 1,
              radius: 5
            },
            events: {
              legendItemClick: (function() {
                return function(event) {
                  var index;
                  index = this.options.legendIndex;
                  if (__indexOf.call(globals.fieldSelection, index) >= 0) {
                    arrayRemove(globals.fieldSelection, index);
                  } else {
                    globals.fieldSelection.push(index);
                  }
                  return self.delayedUpdate();
                };
              })()
            }
          }
        },
        series: [],
        title: {},
        yAxis: {
          minorTickInterval: 'auto',
          title: {
            text: globals.fieldSelection.length !== 1 ? 'Y-Values' : data.fields[globals.fieldSelection[0]].fieldName
          }
        }
      };
      this.chartOptions.xAxis = [];
      this.chartOptions.xAxis.push({});
      return this.chartOptions.xAxis.push({
        lineWidth: 0,
        categories: ['']
      });
    };

    /*
        Builds the 'fake series' for legend controls.
            Derrived objects should implement this.
    */


    BaseHighVis.prototype.buildLegendSeries = function() {
      console.log(console.trace());
      return alert("BAD IMPLEMENTATION ALERT!\n\nCalled: 'BaseVis.buildLegendSeries'\n\nSee logged stack trace in console.");
    };

    /*
        Start sequence used by runtime
            This is called when the user switched to this vis.
            Should re-build options and the chart itself to ensure sync with global settings.
            This method should also be usable as a 'full update' in that it should destroy the current chart if it exists before generating a fresh one.
    
            TODO: Update comment
    */


    BaseHighVis.prototype.start = function() {
      this.buildOptions();
      this.chart = new Highcharts.Chart(this.chartOptions);
      ($('#' + this.canvas)).show();
      return BaseHighVis.__super__.start.call(this);
    };

    /*
        Update minor state
            Clears current series and re-loads the legend.
    
            Derrived classes should overload to add data drawing.
    */


    BaseHighVis.prototype.update = function() {
      var options, temp, title, _i, _len, _ref4, _results;
      title = globals.fieldSelection.length !== 1 ? temp = {
        text: 'Y-Values'
      } : temp = {
        text: data.fields[globals.fieldSelection[0]].fieldName
      };
      this.chart.yAxis[0].setTitle(title, false);
      while (this.chart.series.length !== 0) {
        this.chart.series[0].remove(false);
      }
      _ref4 = this.buildLegendSeries();
      _results = [];
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        options = _ref4[_i];
        _results.push(this.chart.addSeries(options, false));
      }
      return _results;
    };

    /*
        Performs an update while displaying the loading text
    */


    BaseHighVis.prototype.delayedUpdate = function() {
      var mySelf, update;
      this.chart.showLoading('Loading...');
      mySelf = this;
      update = function() {
        return mySelf.update();
      };
      setTimeout(update, 1);
      return this.chart.hideLoading();
    };

    /*
        Method called when vis resize has begun
            Resize highcharts to match
    */


    BaseHighVis.prototype.resize = function(newWidth, newHeight, duration) {
      return this.chart.setSize(newWidth, newHeight, {
        duration: duration,
        easing: 'linear'
      });
    };

    /*
        End sequence used by runtime
            This is called when the user switches away from this vis.
            Should destroy the chart, hide its canvas and remove controls.
    */


    BaseHighVis.prototype.end = function() {
      if (this.chart != null) {
        this.chart.destroy();
        this.chart = void 0;
      }
      return ($('#' + this.canvas)).hide();
    };

    /*
        Remove the chart and chart options object
    */


    BaseHighVis.prototype.serializationCleanup = function() {
      delete this.chart;
      return delete this.chartOptions;
    };

    return BaseHighVis;

  })(BaseVis);

}).call(this);
