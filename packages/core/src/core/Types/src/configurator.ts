import { Component } from ".";

interface UIHint {
  type: "NumberInput" | "Selector" | "TextInput" | "ColorInput" | "Checkbox";
  slider?: boolean;
  min?: number;
  max?: number;
  options?: { [name: string]: any };
  color?: string;
  opacity?: number;
  value: any;
}

export abstract class Configurator<T extends Record<string, any>> {
  protected _component: Component;
  constructor(component: Component) {
    this._component = component;
  }

  uiHints?: { [config: string]: UIHint };

  protected overwrite(config?: Partial<T>) {
    let wasConfigured = false;
    for (const key in config) {
      if (!(key in this)) continue;
      const _this = this as Record<keyof T, any>;
      _this[key] = config[key];
      wasConfigured = true;
    }
    if (wasConfigured && this._component.isConfigurable()) {
      this._component.onSetup.trigger();
    }
  }
}
