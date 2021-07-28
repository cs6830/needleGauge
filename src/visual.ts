/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import { VisualSettings } from "./settings";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;

import DataView = powerbi.DataView;
import DataViewTable = powerbi.DataViewTable;
import IVisualHost = powerbi.extensibility.IVisualHost;


import * as d3 from "d3";
import { area} from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
    private host: IVisualHost;
    private svg: Selection<SVGElement>;
    private container: Selection<SVGElement>;
    private arcBackground: Selection<SVGElement>;
    private arcPlan: Selection<SVGElement>;

    private arcText: Selection<SVGElement>;
    private arcTextPath: Selection<SVGElement>;
    private needle: Selection<SVGElement>;
    private majorMarker: Selection<SVGElement>;
    private minorMarker: Selection<SVGElement>;
    private gradcircle: Selection<SVGElement>;
    private textcircle: Selection<SVGElement>;

    private circle_defs: Selection<SVGElement>;
    private textValue: Selection<SVGElement>;
    private textLabel: Selection<SVGElement>;

    private arcBackground2: Selection<SVGElement>;
    private majorMarker2: Selection<SVGElement>;
    private minorMarker2: Selection<SVGElement>;
    private textLabel_marker: Selection<SVGElement>;
    private circle2_defs: Selection<SVGElement>;
    private gradcircle2: Selection<SVGElement>;
    private needle2: Selection<SVGElement>;
    
    private visualSettings: VisualSettings;

    constructor(options: VisualConstructorOptions) {
        this.svg = d3.select(options.element)
            .append('svg')
            .classed('needleGauge', true);
        this.container = this.svg.append("g")
            .classed('container', true);
        this.arcBackground = this.container.append("path")
            .classed('path', true);
        this.arcPlan = this.container.append("path")
            .classed('path', true);
        this.arcText   = this.container.append("text")
            .classed('textPath', true);
        this.arcTextPath = this.arcText.append("textPath")
            .classed('textPath', true);
        this.majorMarker = this.container.append("path")
            .classed('path', true);
        this.textLabel_marker = this.container.append("g")
            .classed('container', true);
        
        this.minorMarker = this.container.append("path")
            .classed('path', true);
        this.circle_defs = this.container.append("defs").append("radialGradient")

        this.gradcircle = this.container.append("circle")
            .classed("area", true);
        this.needle = this.container.append("path")
            .classed('path', true);

        this.textcircle = this.container.append("circle")
            .classed("area", true);
        this.textValue = this.container.append("text")
            .classed("textValue", true);
        this.textLabel = this.container.append("text")
            .classed("textLabel", true);

        this.arcBackground2 = this.container.append("path")
            .classed('path', true);
        this.majorMarker2 = this.container.append("path")
            .classed('path', true);
        this.minorMarker2 = this.container.append("path")
            .classed('path', true);
        this.needle2 = this.container.append("path")
            .classed('path', true);
        this.circle2_defs = this.container.append("defs").append("filter")

        this.gradcircle2 = this.container.append("path")
        .classed("area", true);
        }
    
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings, options);
    }

    public update(options: VisualUpdateOptions) {
        let dataView: DataView = options.dataViews[0];
        let tableDataView: DataViewTable = dataView.table;
        this.visualSettings = VisualSettings.parse<VisualSettings>(dataView);

        let width:            number = options.viewport.width;
        let height:           number = options.viewport.height;
        this.svg
            .attr("width", width)
            .attr("height", height)

        let Length_radial = this.visualSettings.radialProgressBar.Length;

        this.visualSettings.radialProgressBar.arcLineThickness = Math.max(0, this.visualSettings.radialProgressBar.arcLineThickness);
        this.visualSettings.radialProgressBar.arcLineThickness = Math.min(5, this.visualSettings.radialProgressBar.arcLineThickness);
        let arcLineThickness: number = this.visualSettings.radialProgressBar.arcLineThickness;
        let arcWidth:         number = this.visualSettings.radialProgressBar.arcWidth;

        this.visualSettings.radialProgressBar.arcCornerRadius = Math.min(arcWidth/2, this.visualSettings.radialProgressBar.arcCornerRadius);
        let arcCornerRadius:  number = this.visualSettings.radialProgressBar.arcCornerRadius;

        let arcOffset:        number = this.visualSettings.radialProgressBar2.arcOffset;
        let showSecondaryBar         = this.visualSettings.radialProgressBar2.show || this.visualSettings.radialMarker2.show;
            width = Math.min(width, width - arcOffset*1.1*Number(showSecondaryBar))
        let Length_radial2:   number = this.visualSettings.radialProgressBar2.Length;
        let arcWidth2:        number = this.visualSettings.radialProgressBar2.arcWidth;
        let arcLineThickness2:number = this.visualSettings.radialProgressBar2.arcLineThickness;
        let arcCornerRadius2: number = this.visualSettings.radialProgressBar2.arcCornerRadius;

        let actual:           number = Number(tableDataView.rows[0][0])
        let plan:             number = Number(tableDataView.rows[0][1])

        let sin_theta = Math.sin((Length_radial/2 - 0.5)*Math.PI)
        let cos_theta = Math.cos((Length_radial/2 - 0.5)*Math.PI)
        let r = height /(sin_theta + 1);
        let radius = Math.min(width/2, r)*0.9;
        let h = radius/2 - radius*sin_theta/2;
        let ty = height/2 + h;
        let tr = 'translate(' + width / 2 + ',' + ty + ')';


        if (plan == 1) var plan_ = 1.01; else plan_ = plan;
        let endAngle: number = (plan_ * 2 - 1) * 0.5

    // arc Generator
        const arcBackground_attb = d3.arc()
            .innerRadius(radius - arcWidth)
            .outerRadius(radius)
            .startAngle(-0.5 * Length_radial *1.01 * Math.PI)
            .endAngle(0.5 * Length_radial *1.01 * Math.PI)
            .cornerRadius(arcCornerRadius);

        const arcPlan_attb = d3.arc()
            .innerRadius(radius - arcWidth)
            .outerRadius(radius)
            .startAngle(-0.5 * Length_radial *1.01 * Math.PI)
            .endAngle(endAngle * Length_radial * Math.PI)
            .cornerRadius(arcCornerRadius);

    // Draw arcBackground
        this.arcBackground
            .style("fill", this.visualSettings.radialProgressBar.arcFillColor)
            .style("stroke", this.visualSettings.radialProgressBar.arcLineColor)
            .style("stroke-width", this.visualSettings.radialProgressBar.arcLineThickness)
            .attr('d', arcBackground_attb)
            .attr('transform', tr);

    // Draw arcPlan
        this.arcPlan
            .style("fill", this.visualSettings.radialProgressBar.arcPlanColor)
            .style("stroke", this.visualSettings.radialProgressBar.arcLineColor)
            .style("stroke-width", arcLineThickness)
            .attr('d', arcPlan_attb)
            .attr('id', 'arcText')
            .attr('transform', tr);

        var offset = { min: (Length_radial-1.1) * 16,
                   max: (Length_radial-1.1) * 14}

        var offsetRange = d3.scaleLinear().domain([0.6, 1.6]).range([offset.min, offset.max])(Length_radial)


    // Draw Text inside Radial Bar 
        this.arcText
            .attr('x', arcWidth/10 * d3.scaleLinear().domain([0.1, 1]).range([-15, offsetRange])(plan))
            .attr('dy', arcWidth*0.75)
        
        this.arcTextPath    // minimum condition for text to be visible if 1.6*plan >= arcWidth
            .attr("xlink:href", "#arcText")
            .style("text-anchor","middle")
            .style("font-size", arcWidth*.8)
            .style("fill", this.visualSettings.RadialBarText.textFontColor)
            .attr("startOffset", "50%")
            .text(d => {
                if(plan*Length_radial*100 >= arcWidth) return String((Math.round(plan*1000)/10).toFixed(1)) + '%'});

        if (this.visualSettings.RadialBarText.show) {
            this.arcTextPath.style("display", 'inherit')
        } else
            this.arcTextPath.style("display", 'none')

        
    // Secondary Arc Generator

    let radius2 = Math.min(width/2, r)*0.9 + arcOffset;
    let endAngle2 = Math.asin((radius * sin_theta)/radius2)+Math.PI/2;
    let startAngle2 = endAngle2 - Length_radial2 * Math.PI;
        const arcBackground_attb2 = d3.arc()
            .innerRadius(radius + arcOffset - arcWidth2)
            .outerRadius(radius + arcOffset)
            .startAngle(startAngle2 - endAngle2 * 0.01)
            .endAngle(endAngle2 * 1.01)
            .cornerRadius(arcCornerRadius2);

    // Draw Secondary arcBackground
        this.arcBackground2
            .style("fill", this.visualSettings.radialProgressBar2.arcFillColor)
            .style("stroke", this.visualSettings.radialProgressBar2.arcLineColor)
            .style("stroke-width", this.visualSettings.radialProgressBar2.arcLineThickness)
            .attr('d', arcBackground_attb2)
            .attr('transform', tr);
    
        if (this.visualSettings.radialProgressBar2.show) {
            this.arcBackground2.style("display", 'inherit')
        } else
            this.arcBackground2.style("display", 'none')


    
    // Primaray Marker Generator
        var h_marker = {major: this.visualSettings.radialMarker.markerHeight_major,
                        minor: this.visualSettings.radialMarker.markerHeight_minor}
        var w_marker = this.visualSettings.radialMarker.markerWidth;
        var majorMarker: Array<any> = []

        for (let index = 0; index <= 10; index++) {
            majorMarker.push([(2/10*index-1)*0.5 *Length_radial*Math.PI, radius-arcWidth-5])
            majorMarker.push([(2/10*index-1)*0.5 *Length_radial*Math.PI, radius-arcWidth-5-h_marker.major])
            majorMarker.push(null)
        }

        var minorMarker: Array<any> = []
        for (let index = 0; index <= 50; index++) {
            if(index%5 !== 0) {
                minorMarker.push([(2/50*index-1)*0.5*Length_radial*Math.PI, radius-arcWidth-5])
                minorMarker.push([(2/50*index-1)*0.5*Length_radial*Math.PI, radius-arcWidth-5-h_marker.minor])
                minorMarker.push(null)
            }
        }

    // Secondary Marker Generator
        var h_marker2 = {major: this.visualSettings.radialMarker2.markerHeight_major,
                         minor: this.visualSettings.radialMarker2.markerHeight_minor}
        var w_marker2 = this.visualSettings.radialMarker2.markerWidth;
        var majorMarker2: Array<any> = []

        for (let index = 0; index <= 5; index++) {
            majorMarker2.push([startAngle2 + (endAngle2 - startAngle2)/5 * index, radius2-arcWidth2-3])
            majorMarker2.push([startAngle2 + (endAngle2 - startAngle2)/5 * index, radius2-arcWidth2-3-h_marker2.major])
            majorMarker2.push(null)
        }

        var minorMarker2: Array<any> = []
        for (let index = 0; index <= 25; index++) {
            if(index%5 !== 0) {
                minorMarker2.push([startAngle2 + (endAngle2 - startAngle2)/25 * index, radius2-arcWidth2-3])
                minorMarker2.push([startAngle2 + (endAngle2 - startAngle2)/25 * index, radius2-arcWidth2-3-h_marker2.minor])
                minorMarker2.push(null)
            }
        }

        var MarkerGenerator = d3.lineRadial()
            .angle(d => d[0])
            .radius(d=> d[1])
            .defined(d => d !== null);


    // needle
        let nt = 2  // needletip width
        let nb = 15 // needle base width
        let nl = radius - arcWidth - 5
        var needle = d3.path()
            needle.arc(0, 0, nb/2, -(1+nb/nl/4)*Math.PI, 0);
            needle.arc(0, 0, nb/2, 0, nb/nl/4 * Math.PI);
            needle.lineTo(nt/2, nl);
            needle.arc(0, nl, nt/2, 0, Math.PI);
            needle.closePath();

        let needleAngle: number = 180 * (1 - Length_radial/2 + actual*Length_radial)

        this.needle
            .style("fill", "rgb(88, 88, 120)")
            .attr("d", needle.toString())
            .attr('transform', tr + 'rotate(' + needleAngle + ')');

    // needle2
        let nt2 = 3  // needletip width
        let nb2 = 8 // needle base width
        let visible_nl2 = 50
        let nl2 = radius2 - arcWidth2 - 8  // needle length
        let nlt = radius2 - visible_nl2 // needle length trim
        var needle2 = d3.path()
            needle2.moveTo(-nb2/2, nlt);
            needle2.lineTo(nb2/2, nlt);
            needle2.lineTo(nt2/2, nl2);
            needle2.arc(0, nl2, nt2/2, 0, Math.PI);
            needle2.closePath();

        let actual2 = 0.5
        let needleAngle2: number = (endAngle2 - actual2 * (endAngle2 - startAngle2)) /
                                    Math.PI * 180 + 180

        this.needle2
            .style("fill", "rgb(88, 88, 120)")
            .attr("d", needle2.toString())
            .attr('transform', tr + 'rotate(' + needleAngle2 + ')');

    // needle circle
        var grad = [
            {offset: "0%", color: "rgb(5, 225, 119)"},
            {offset: "50%", color: "rgb(5, 225, 119)"},
            {offset: "90%", color: "rgb(238, 251, 248)"},
            {offset: "100%", color: "rgb(255, 255, 255)"},
        ]

        this.circle_defs
            .attr("id", "radialGradient")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "50%")
            .attr("fx", "50%")
            .attr("fy", "50%");
        this.circle_defs.selectAll("stop").remove()
 
        this.circle_defs.selectAll("stop")
            .data(grad)
            .enter()
            .append("stop")
            .attr("offset", d => d.offset)
            .style("stop-color", d => d.color)
            .style("stop-opacity", "1");

        this.gradcircle
            .attr("r", this.visualSettings.CenterText.diameter * 1.3)
            .attr('transform', tr)
            .attr("fill", "url(#radialGradient)")
        
        this.textcircle
            .attr("r", this.visualSettings.CenterText.diameter)
            .attr('transform', tr)
            .attr("fill", "white")

    // secondary circle (arc)
        var gradArc = d3.path()
            gradArc.arc(0, 0,  nlt, Math.asin((radius * sin_theta)/radius2), 
                        Math.asin((radius * sin_theta)/radius2) - Length_radial2 * Math.PI, true)

        this.circle2_defs
            .attr("id", "radialGradient2")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "200%")
            .attr("height", "200%")
            // .attr("cx", "0.5")      // x coordinate start of circle
            // .attr("cy", "50%")      // y coordinate end of circle
            // .attr("r",  "50%")      // radius of the end circle
            // .attr("fr",  "50%")      // radius of the start circle
            // .attr("fx", "50%")      // x coordinate start of circle
            // .attr("fy", "50%");     // y coordinate end of circle

        this.circle2_defs.selectAll("feOffset").remove()
        this.circle2_defs.selectAll("feBlend").remove()

        this.circle2_defs
            .append("feOffset")
            .attr("result", "offOut")
            .attr("in", "SourceGraphic")
            .attr("dx", "20")
            .attr("dy", "20");

        this.circle2_defs
            .append("feBlend")
            .attr("in", "SourceGraphic")
            .attr("in2", "offOut")
            .attr("mode", "normal")
        //     .data(grad)
        //     .enter()
        //     .append("stop")
        //     .attr("offset", d => d.offset)
        //     .style("stop-color", d => d.color)
        //     .style("stop-opacity", "1");

        this.gradcircle2
            .style("fill", "url(#radialGradient2)")
            // .style("fill", "#DDFFDD")
            .style("stroke", "rgb(5, 225, 119)")
            .style("fill", "none")
            .style("stroke-width", 3)
            .attr('d', gradArc.toString())
            .attr('transform', tr);
        

    //Draw marker
        this.minorMarker
            .style("stroke", "rgb(215, 215, 230)")
            .style("stroke-width", w_marker)
            .style("fill-opacity", 0)
            .attr("d", MarkerGenerator(minorMarker))
            .attr('transform', tr);

        this.majorMarker
            .style("stroke", "rgb(160, 160, 180)")
            .style("stroke-width", w_marker)
            .style("fill-opacity", 0)
            .attr("d", MarkerGenerator(majorMarker))
            .attr('transform', tr);

        var radius_mk = radius-arcWidth-18-h_marker.major
        var markerLabel: Array<any> = [
            {x: -(radius_mk+5) * cos_theta, y: (radius_mk+5) * sin_theta, text: "0", align: "middle"},
            {x: 0,                          y: -(radius_mk+3),            text: "50", align: "middle"},
            {x: radius_mk * cos_theta,      y: (radius_mk+5) * sin_theta, text: "100", align: "middle"}]

        this.textLabel_marker.selectAll("text").remove()

        this.textLabel_marker.selectAll("text")
            .data(markerLabel)
            .enter()
            .append('text')
            .text(d => d.text)
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("dy", "0.25em")
            .attr("text-anchor", d => d.align)
            .style("font-size", "12px");
        
        this.textLabel_marker
            .attr('transform', tr);
 
    // Draw Center Text
        this.textValue
            .text(String((Math.round(actual*1000)/10).toFixed(1)) + '%')
            .attr("x", width/2)
            .attr("y", ty + this.visualSettings.CenterText.offsetPosition)
            .attr("text-anchor", "middle")
            .style("font-family", "Segoe UI")
            .style("font-size", this.visualSettings.CenterText.textFontSize + "px");

        this.textLabel
            .text(dataView.table.columns[0].displayName)
            .attr("x", width/2)
            .attr("y", ty + this.visualSettings.CenterText.offsetPosition)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .style("font-family", "Segoe UI")
            .style("font-size", this.visualSettings.CenterText.labelFontSize + "px");
    
    // Draw Secondary Radial Bar
        this.minorMarker2
            .style("stroke", "rgb(215, 215, 230)")
            .style("stroke-width", w_marker2)
            .style("fill-opacity", 0)
            .attr("d", MarkerGenerator(minorMarker2))
            .attr('transform', tr);

            this.majorMarker2
            .style("stroke", "rgb(160, 160, 180)")
            .style("stroke-width", w_marker2)
            .style("fill-opacity", 0)
            .attr("d", MarkerGenerator(majorMarker2))
            .attr('transform', tr);
        if (this.visualSettings.radialMarker2.show) {
            this.minorMarker2.style("display", 'inherit')
            this.majorMarker2.style("display", 'inherit')

        } else {
            this.minorMarker2.style("display", 'none')
            this.majorMarker2.style("display", 'none')
        }

    }
}
