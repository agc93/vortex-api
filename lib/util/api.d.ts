/// <reference types="i18next" />
export * from './message';
export * from './storeHelper';
import { resolveCategoryName, resolveCategoryPath } from '../extensions/category_management';
import { getGame, getGames } from '../extensions/gamemode_management';
import deriveModInstallName from '../extensions/mod_management/modIdManager';
import renderModName from '../extensions/mod_management/util/modName';
import resolvePath from '../extensions/mod_management/util/resolvePath';
import sortMods from '../extensions/mod_management/util/sort';
import testModReference from '../extensions/mod_management/util/testModReference';
import { Archive } from './archives';
import copyRecursive from './copyRecursive';
import { DataInvalid, NotSupportedError, ProcessCanceled, SetupError, UserCanceled } from './CustomErrors';
import Debouncer from './Debouncer';
import delayed from './delayed';
import { terminate } from './errorHandling';
import { extend } from './ExtensionProvider';
import getNormalizeFunc, { Normalize } from './getNormalizeFunc';
import { getCurrentLanguage } from './i18n';
import LazyComponent from './LazyComponent';
import lazyRequire from './lazyRequire';
import makeReactive from './makeReactive';
import ReduxProp from './ReduxProp';
import relativeTime from './relativeTime';
import steam, { ISteamEntry } from './Steam';
import { bytesToString, copyFileAtomic, isNullOrWhitespace, objDiff, removePersistent, setdefault } from './util';
import walk from './walk';
import { runElevated, runThreaded } from 'vortex-run';
export { Archive, bytesToString, copyFileAtomic, copyRecursive, DataInvalid, Debouncer, delayed, deriveModInstallName as deriveInstallName, extend, getCurrentLanguage, getGame, getGames, getNormalizeFunc, isNullOrWhitespace, LazyComponent, lazyRequire, makeReactive, Normalize, NotSupportedError, objDiff, ProcessCanceled, ReduxProp, relativeTime, removePersistent, renderModName, resolveCategoryName, resolveCategoryPath, resolvePath, runElevated, runThreaded, setdefault, SetupError, sortMods, steam, ISteamEntry, terminate, testModReference, UserCanceled, walk };
export declare type TextGroup = 'mod';
import * as I18next from 'i18next';
export declare function getText(group: TextGroup, textId: string, t: I18next.TranslationFunction): any;
