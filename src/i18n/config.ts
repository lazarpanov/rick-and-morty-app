import i18n from "i18next";                      
// Bindings for React: allow components to
// re-render when language changes.
import { initReactI18next } from "react-i18next";

export const supportedLngs = {
    en: "English",
    de: "Deutsch",
};

i18n
  // Add React bindings as a plugin.
  .use(initReactI18next)
  // Initialize the i18next instance.
  .init({
    // Config options

    // Specifies the default language (locale) used
    // when a user visits our site for the first time.
    // We use English here, but feel free to use
    // whichever locale you want.                   
    lng: "en",

    // Fallback locale used when a translation is
    // missing in the active locale. Again, use your
    // preferred locale here. 
    fallbackLng: "en",

    // Enables useful output in the browser’s
    // dev console.
    supportedLngs: Object.keys(supportedLngs),
    debug: true,

    // Normally, we want `escapeValue: true` as it
    // ensures that i18next escapes any code in
    // translation messages, safeguarding against
    // XSS (cross-site scripting) attacks. However,
    // React does this escaping itself, so we turn 
    // it off in i18next.
    interpolation: {
      escapeValue: false,
    },

    // Translation messages. Add any languages
    // you want here.
    resources: {
      // English
      en: {
        // `translation` is the default namespace.
        // More details about namespaces shortly.
        translation: {
          hello_world: "Hello, World!",
          name: "Name",
          status: "Status",
          species: "Species",
          gender: "Gender",
          origin: "Origin",
          dimension: "Dimension",
          select_status: "Select status",
          select_species: "Select species",
          select_sort: "Select sort"
        },
      },
      de: {
        translation: {
            hello_world: "Hello, World!",
            name: "Name",
            status: "Status",
            species: "Spezies",
            gender: "Geschlecht",
            origin: "Herkunft",
            dimension: "Dimension",
            select_status: "Status wählen",
            select_species: "Spezies wählen",
            select_sort: "Sortierung wählen"
        },
      },
    },
  });

export default i18n;