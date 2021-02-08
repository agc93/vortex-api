import { IExecInfo } from './IExecInfo';
import { IExtensionApi } from './IExtensionContext';
import { IGameStoreEntry } from './IGameStoreEntry';
import Promise from 'bluebird';
export declare type GameLaunchType = 'gamestore' | 'commandline';
export declare class GameStoreNotFound extends Error {
    private mName;
    constructor(name: any);
    get storeName(): string;
}
export declare class GameEntryNotFound extends Error {
    private mName;
    private mStore;
    private mExistingNames;
    constructor(name: string, store: string, existing?: string[]);
    get gameName(): string;
    get storeName(): string;
    get existingGames(): string[];
}
export interface ICustomExecutionInfo {
    appId: string;
    parameters: string[];
    launchType?: GameLaunchType;
}
/**
 * interface for game store launcher extensions
 *
 * @interface IGameStore
 */
export interface IGameStore {
    /**
     * This launcher's id.
     */
    id: string;
    /**
     * Returns all recognized/installed games which are currently
     *  installed with this game store/launcher. Please note that
     *  the game entries should be cached to avoid running a potentially
     *  resource intensive operation for each game the user attempts to
     *  manage.
     */
    allGames: () => Promise<IGameStoreEntry[]>;
    /**
     * Attempt to find a game entry using its game store Id/Ids.
     *
     * @param appId of the game entry. This is obviously game store specific.
     */
    findByAppId: (appId: string | string[]) => Promise<IGameStoreEntry>;
    /**
     * Attempt to find a game store entry using the game's name.
     *
     * @param appName the game name which the game store uses to identify this game.
     */
    findByName: (appName: string) => Promise<IGameStoreEntry>;
    /**
     * Returns the full path to the launcher's executable.
     *  As of 1.4, this function is no longer optional - gamestores
     *  such as the Xbox app which do not have a stat-able store path
     *  should return Promise.resolve(undefined) and define the
     *  "isGameStoreInstalled" function so that the game store helper
     *  is able to confirm that the gamestore is installed on the user's PC
     */
    getGameStorePath: () => Promise<string>;
    /**
     * Launches the game using this game launcher.
     * @param appId whatever the game store uses to identify a game.
     * @param api gives access to API functions if needed.
     */
    launchGame: (appId: any, api?: IExtensionApi) => Promise<void>;
    /**
     * Determine whether the game has been installed by this game store launcher.
     *  returns true if the game store installed this game, false otherwise.
     *
     * @param name of the game we're looking for.
     */
    isGameInstalled?: (name: string) => Promise<boolean>;
    /**
     * In most cases the game store helper is fully capable of determining
     *  whether a gamestore is installed by stat-ing the store's executable.
     *
     * However, gamestores such as the Xbox store which do not have a stat-able
     *  executable path MUST provide this function so that the game store helper
     *  can confirm that the store is installed correctly!
     */
    isGameStoreInstalled?: () => Promise<boolean>;
    /**
     * Some launchers may support Posix paths when attempting to launch a
     *  game, if set, the launcher will be expected to generate a valid
     *  posix path which Vortex can use to start the game.
     *
     * Please note that Vortex will not be able to tell if the game
     *  actually launched successfully when using Posix Paths; reason
     *  why this should only be used as a last resort.
     *
     * @param name of the game we want the posix path for.
     */
    getPosixPath?: (name: string) => Promise<string>;
    /**
     * Game store may support command line arguments when launching the game.
     *  Function will return the path to the game store's executable and any required
     *  arguments to launch the game.
     *
     * @param appId - Whatever the game store uses to identify a game.
     */
    getExecInfo?: (appId: any) => Promise<IExecInfo>;
    /**
     * Generally the game store helper should be able to launch games directly.
     *  This functor allows game stores to define their own custom start up logic
     *  if needed. e.g. gamestore-xbox
     */
    launchGameStore?: (api: IExtensionApi, parameters?: string[]) => Promise<void>;
    /**
     * Allows game stores to provide functionality to reload/refresh their
     *  game entries. This is potentially a resource intensive operation and
     *  should not be called unless it is vital to do so.
     *
     * The game store helper is configured to call this function for all known
     *  game stores when a discovery scan is initiated.
     */
    reloadGames?: () => Promise<void>;
}
