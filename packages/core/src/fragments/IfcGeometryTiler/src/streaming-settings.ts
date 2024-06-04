// eslint-disable-next-line max-classes-per-file
import { IfcLoaderConfig } from "../../IfcLoader/src";

/** Configuration of the IFC-fragment streaming. */
export class IfcStreamingSettings extends IfcLoaderConfig {
  minGeometrySize = 10;
  minAssetsSize = 1000;
}

/** Configuration of the IFC-fragment streaming. */
export class PropertiesStreamingSettings extends IfcLoaderConfig {
  propertiesSize = 100;
}
