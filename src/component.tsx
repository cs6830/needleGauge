import * as React from "react";

export interface State {
    textLabel: string,
    textValue: string,
    size: number,
    background?: string,
    borderWidth?: number
}

export const initialState: State = {
    textLabel: "",
    textValue: "",
    size: 200
}