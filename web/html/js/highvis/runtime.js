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
  var _ref;

  if ((_ref = window.globals) == null) {
    window.globals = {};
  }

  globals.curVis = null;

  /*
  CoffeeScript version of runtime.
  */


  ($(document)).ready(function() {
    var can, vis, _i, _len, _ref1;
    _ref1 = ['#map_canvas', '#timeline_canvas', '#scatter_canvas', '#bar_canvas', '#histogram_canvas', '#table_canvas', '#viscanvas'];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      can = _ref1[_i];
      ($(can)).hide();
    }
    /* Generate tabs
    */

    for (vis in data.relVis) {
      ($('#vis_select')).append('<li class="vis_tab_' + vis + '"><a href="#">' + data.relVis[vis] + '</a></li>');
    }
    ($('#vis_select > li > a')).css('background-color', '#ccc');
    ($('#vis_select > li > a')).css('border-bottom', '1px solid black');
    ($('.vis_tab_0 > a')).css('background-color', '#fff');
    ($('.vis_tab_0 > a')).css('border-bottom', '1px solid white');
    globals.curVis = eval('globals.' + data.relVis[0].toLowerCase());
    ($('#vis_select > li > a')).unbind();
    /* Change vis click handler
    */

    ($('#vis_select')).children().children().click(function() {
      if (globals.curVis != null) {
        globals.curVis.end();
      }
      /* Remove old selection
      */

      ($('#vis_select  > li > a')).css('background-color', '#ccc');
      ($('#vis_select  > li > a')).css('border-bottom', '1px solid black');
      globals.curVis = eval('globals.' + this.text.toLowerCase());
      /* Set new selection
      */

      ($(this)).css("background-color", "#ffffff");
      ($(this)).css('border-bottom', '1px solid white');
      return globals.curVis.start();
    });
    return globals.curVis.start();
  });

}).call(this);
