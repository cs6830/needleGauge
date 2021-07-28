/*
 *  Power BI Visualizations
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

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class GaugeSettings {
    public Length: number = 1;
    public arcWidth: number = 10;
    public arcLineThickness: number = 1;
    public arcCornerRadius: number = 5;
    public arcOffset: number = 40;
    public arcLineColor: string = "grey";
    public arcFillColor: string = '#F6F6F6';
    public arcPlanColor: string = "lightblue";
    public show: boolean = false;
}
export class MarkerSettings {
    public markerHeight_major: number = 5;
    public markerHeight_minor: number = 3;
    public markerWidth: number = 1;
    public minimum: number = 0;
    public maximum: number = 1;
    public show: boolean = false;
}

export class PrimaryTextProperties{
    public textFontSize: number = 14;
    public labelFontSize: number = 10;
    public offsetPosition: number = 20;
    public textFontColor: string = "#353535";
    public labelFontColor: string = "#646464";
    public diameter: number = 30;
    public show: boolean = false;
}

export class VisualSettings extends DataViewObjectsParser {
    public radialProgressBar: GaugeSettings = new GaugeSettings();
    public radialMarker: MarkerSettings = new MarkerSettings();
    public CenterText: PrimaryTextProperties = new PrimaryTextProperties();
    public RadialBarText: PrimaryTextProperties = new PrimaryTextProperties();
    public radialProgressBar2: GaugeSettings = new GaugeSettings();
    public radialMarker2: MarkerSettings = new MarkerSettings();
}