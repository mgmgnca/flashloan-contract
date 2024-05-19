import { Routers } from "../constants";
/**
 * @param protocol
 * @returns router address
 */
export const findRouterFromProtocol = (protocol: number) => {
    return Routers[Object.keys(Routers)[protocol]];
};
  