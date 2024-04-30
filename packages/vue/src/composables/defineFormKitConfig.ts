import type {
  FormKitOptions,
  FormKitLibrary,
  FormKitPlugin,
  FormKitConfig,
} from '@formkit/core'
import type { DefaultConfigOptions } from '../index'
import type { FormKitValidationRule } from '@formkit/validation'
import type { FormKitIconLoader, FormKitIconLoaderUrl } from '@formkit/themes'
import type { FormKitLocale, FormKitLocaleRegistry } from '@formkit/i18n'

/**
 * Configuration for plugins
 *
 * @public
 */
export interface PluginConfigs {
  /**
   * Custom validation rules. See the {@link https://formkit.com/essential/validation | validation docs} for information on how to write your own rules.
   */
  rules: Record<string, FormKitValidationRule>
  /**
   * i18n locales. See the {@link https://formkit.com/essential/internationalization | i18n docs} for more details.
   */
  locales: FormKitLocaleRegistry
  /**
   * Custom inputs. See the {@link https://formkit.com/essential/inputs | input docs} for more details and information on how to write your own inputs.
   */
  inputs: FormKitLibrary
  /**
   * Override the i18n locales on a per-message basis. The structure should be:
   * ```ts
   * {
   *   en: {
   *     validation: {
   *       required: 'This field is super required',
   *     }
   *   }
   * }
   * ```
   */
  messages: Record<string, Partial<FormKitLocale>>
  /**
   * The default locale.
   */
  locale: string
  /**
   * A theme to use for the form.
   */
  theme: string
  /**
   * The URL to load icons from.
   */
  iconLoaderUrl: FormKitIconLoaderUrl
  /**
   * The icon loader to use.
   */
  iconLoader: FormKitIconLoader
  /**
   * A custom set of icons to use. To provide your own simply provide a key-value pair of the icon name and the SVG string.
   * ```ts
   * {
   *   'check': '<svg>...</svg>',
   * }
   * ```
   */
  icons: Record<string, string | undefined>
}

/**
 * Determines how a given optimization should be handled. If `false` the
 * optimization will be disabled and a fallback will be used. If `true`
 * (default) the optimization will be enabled and only the necessary code will
 * be loaded on a per-instance basis. If an object is provided, you can disable
 * also specify whether or not to use the FormKit builtin features. For example
 * given the following configuration:
 *
 * ```js
 * export default defineFormKitConfig({
 *   optimize: {
 *     inputs: {
 *       optimize: true,
 *       builtins: false
 *     }
 *   }
 * })
 * ```
 * And the following usage: `<FormKit type="text" />` — the text input will not
 * automatically be loaded from `@formkit/inputs` — instead only explicitly
 * defined inputs (`DefineConfigOptions['inputs']`) will be used.
 */
export type OptimizeOptions = boolean | { optimize: boolean; builtins: boolean }

/**
 * Define the configuration options for FormKit. This configuration format
 * is slightly different than the legacy DefaultConfigOptions. It is
 */
export type DefineConfigOptions = {
  /**
   * Experimental: Perform build-time optimizations — for example — only loading
   * the inputs, validation rules, and locales that are required per <FormKit>
   * instance. This can significantly reduce the size of your bundle.
   * (default: false)
   */
  optimize:
    | boolean
    | {
        /**
         * Disable input optimizations that only load the inputs being used at the
         * location where they are used. Disabling this optimization will revert to
         * using an input library of all available inputs. (default: true)
         */
        inputs?: OptimizeOptions
        /**
         * Disable validation optimizations that only load the validation rules
         * being used at the location where they are used. Disabling this
         * optimization will revert to using all available validation rules.
         * (default: true)
         */
        validation?: OptimizeOptions
        /**
         * Disable i18n optimizations that only load the locale messages being used
         * at the location where they are used. Disabling this optimization will
         * revert to using all available locales. (default: true)
         */
        i18n?: OptimizeOptions
        /**
         * Disable icon optimizations that loads icons from their sources at build
         * time at the locations where they are used in your app. Disabling this
         * optimization will revert to using a runtime icon loader. (default: true)
         */
        icons?: OptimizeOptions
        /**
         * Disable theme optimizations that attempts to only inject the
         * necessary classes at their point of use in your app. Disabling this
         * optimization will revert to importing the entire rootClasses object.
         * (default: true)
         */
        theme?: OptimizeOptions
      }
  /**
   * An object of options to pass to the `createNode()` function whenever a new core node is created.
   */
  nodeOptions?: Partial<FormKitOptions>
  /**
   * An array of plugins to pass to the `createNode()` function whenever a new core node is created.
   */
  plugins?: FormKitPlugin[]
  /**
   * An array of strings, where each is the name of a ui message to localize. {@link https://github.com/formkit/formkit/blob/master/packages/i18n/src/locales/en.ts#L18 | Check any locale’s `ui` object} for the available messages.
   */
  localize?: string[]
} & Partial<PluginConfigs>

/**
 * @deprecated - Using DefaultConfigOptions is no longer the recommended way to
 * configure FormKit globally. Consider using DefineConfigOptions instead. This
 * only requires moving the `config` property inside a `nodeOptions` key.
 *
 * ```ts
 * defineFormKitConfig({
 *   rules: {
 *     // custom rules here
 *   },
 *   inputs: {
 *     // custom inputs here
 *   },
 *   nodeOptions: {
 *     config: {
 *       // node config here
 *     }
 *   }
 * })
 * ```
 */
export type LegacyDefaultConfigOptions = Omit<
  DefaultConfigOptions,
  'config'
> & { config: Partial<FormKitConfig> }

/**
 * @deprecated - Using a function inside defineFormKitConfig is no longer
 * the recommended way to configure FormKit globally. Continuing to a function
 * will not allow your FormKit’s build tooling to optimize your configuration.
 */
export type FunctionalConfigOptions = () => DefaultConfigOptions

/**
 * Define the global configuration options for FormKit. In order to leverage
 * FormKit’s automatic configuration optimization ensure everything in this
 * object can be statically analyzed. For example, avoid spreading (...options)
 * or using functions.
 * @param config - The configuration options for FormKit.
 */
export function defineFormKitConfig(
  config: DefineConfigOptions
): () => DefineConfigOptions
/**
 * @deprecated - Using DefaultConfigOptions is no longer the recommended way to
 * configure FormKit globally. Consider using DefineConfigOptions instead. This
 * only requires moving the `config` property inside a `nodeOptions` key.
 *
 * ```ts
 * defineFormKitConfig({
 *   rules: {
 *     // custom rules here
 *   },
 *   inputs: {
 *     // custom inputs here
 *   },
 *   nodeOptions: {
 *     config: {
 *       // node config here
 *     }
 *   }
 * })
 * ```
 */
export function defineFormKitConfig(
  config: LegacyDefaultConfigOptions
): () => LegacyDefaultConfigOptions
/**
 * @deprecated - Using a function inside defineFormKitConfig is no longer
 * the recommended way to configure FormKit globally. Continuing to use a
 * function will not allow your FormKit’s build tooling to optimize your
 * configuration.
 */
export function defineFormKitConfig(
  config: FunctionalConfigOptions
): () => DefaultConfigOptions
export function defineFormKitConfig(
  config:
    | DefineConfigOptions
    | FunctionalConfigOptions
    | LegacyDefaultConfigOptions
) {
  return () => (typeof config === 'function' ? config() : config)
}
