import * as d3 from "d3-selection";
import * as d3Time from "d3-time";
import * as d3TimeFormat from "d3-time-format";
import * as d3Scale from "d3-scale";
import * as d3Axis from "d3-axis";
import * as d3Array from "d3-array";
import * as d3Shape from "d3-shape";
import * as d3Fetch from "d3-fetch";

Object.assign(d3, d3TimeFormat, d3Time, d3Fetch, d3Scale, d3Axis, d3Array, d3Shape);

export default d3;