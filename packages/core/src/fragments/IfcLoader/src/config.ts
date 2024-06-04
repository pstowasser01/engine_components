import * as WEBIFC from "web-ifc";
import { Components } from "../../..";
import { Configurator } from "../../../core/Types/src/configurator";

export interface IfcLoaderSettings {
  includeProperties: boolean;
  optionalCategories: number[];
  coordinate: boolean;
  excludedCategories: Set<number>;
  saveLocations: boolean;
  webIfc: WEBIFC.LoaderSettings;
  customLocateFileHandler: WEBIFC.LocateFileHandlerFn | null;
  wasm: {
    path: string;
    absolute: boolean;
    logLevel?: WEBIFC.LogLevel;
  };
}

export class IfcLoaderConfig
  extends Configurator<IfcLoaderSettings>
  implements IfcLoaderSettings
{
  async set(config?: Partial<IfcLoaderSettings>) {
    await this.autoSetWasm();
    this.overwrite(config);
  }

  includeProperties = true;

  /**
   * Generate the geometry for categories that are not included by default,
   * like IFCSPACE.
   */
  optionalCategories = [WEBIFC.IFCSPACE];

  /** Whether to use the coordination data coming from the IFC files. */
  coordinate = true;

  /** Path of the WASM for [web-ifc](https://github.com/ThatOpen/engine_web-ifc). */
  wasm: {
    path: string;
    absolute: boolean;
    logLevel?: WEBIFC.LogLevel;
  } = {
    path: "",
    absolute: false,
    logLevel: WEBIFC.LogLevel.LOG_LEVEL_OFF,
  };

  /** List of categories that won't be converted to fragments. */
  excludedCategories = new Set<number>();

  /** Whether to save the absolute location of all IFC items. */
  saveLocations = false;

  /** Loader settings for [web-ifc](https://github.com/ThatOpen/engine_web-ifc). */
  webIfc: WEBIFC.LoaderSettings = {
    COORDINATE_TO_ORIGIN: true,
    OPTIMIZE_PROFILES: true,
  };

  async autoSetWasm() {
    const componentsPackage = await fetch(
      `https://unpkg.com/openbim-components@${Components.release}/package.json`,
    );
    if (!componentsPackage.ok) {
      console.warn(
        "Couldn't get openbim-components package.json. Set wasm settings manually.",
      );
      return;
    }
    const componentsPackageJSON = await componentsPackage.json();
    if (!("web-ifc" in componentsPackageJSON.peerDependencies)) {
      console.warn(
        "Couldn't get web-ifc from peer dependencies in openbim-components. Set wasm settings manually.",
      );
    } else {
      const webIfcVer = componentsPackageJSON.peerDependencies["web-ifc"];
      this.wasm.path = `https://unpkg.com/web-ifc@${webIfcVer}/`;
      this.wasm.absolute = true;
    }
  }

  customLocateFileHandler: WEBIFC.LocateFileHandlerFn | null = null;
}
