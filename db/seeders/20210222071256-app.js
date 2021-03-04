"use strict";
const ModuleLibrary = require("../../controllers/module");
const moduleLibrary = new ModuleLibrary();
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "abouts",
      [
        {
          appName:
            "Z/PmslUILeyD3CGwRhgivKaigrc6P63r6zeMJg4EY2I6vKRy4kO4ijLMMogGdqEs3m0e3iK8kpHqc+sngLxqJEBYgSrBTTSm5+ZiVt4TNwAbN5xsMcVBskUluJT7DAR3znPGQ3PjiUvZjdFELnQ4VxIzFp6+q/rVSnhPKn8AYtNQwUzYTAJb/NHvaSMUqEf5fDdn/LhQUexIxo3GGQsLYeEoTSIO7Wfo7Ub63WGaZ/qFDya6UJn2L+sfY2bbgFaWtqjLA6FPj9iGwmCzu71JDwsa6pPt7YSQzswZMwGYTgf4Phr/HeJg9TstWd7YwykUUykyeYM+4cAy+WpgQoQifjCaDpZxXafGYv2mjQnBt2lL9+5JZA56s5WkW0wUwyH8k8l+ESDNN9rxMPFbiWP4FAJWOcjRw/2rI6d2mwcMhNAKW/XLk3QBMWfGk4a7rIVTIhVZlf1HJ4N/iu/uztPmD2/BypgrgBku+43nSWQPnFYM1jrXq30SEcVj5TmmaJBQcd9p0bsf/DramVpGQFtfpEjWArqYbxZCxqU26VYG1gZiB0baY1S45LOLIs7CA0GbP0/6MSO3PWKHEnRgbhw6s0QzJhV6w/oVfH50AFhgRfVQm7AKsWRNVQHcEpI37zS93qzgkwcWnDMB1BbkM4bsXf7/t2mcvzRpE1ODLEp58SQ=",
          start:
            "DAiUOFUTz8kugOWHvPF8fvGvoBWjDQjxJ8Z1JcbBlDVPqCpXU8iRx/YQHA8L+VU96zbYE9WgQPvQDS/fOKpNQGBxWknjR1o6cLc5x5LG9RBiqfcqSlQblFK6erPXydqW9CVWU8nF3UQq7liLwsblu5zGvbhBaH4a9FndXrtI4Gloo3kQc/npwpVKwn2r8VuLKmQ7s28YnfGqlkVaVxgUto4H/D49fwVS2NYgey/NGTCtMWS+DddMTARLzRG3pZnwezAugeuIXIzgRhnF7wsjdpgKPmBUddk++3PVAJjD+/KdtNm+IZkimX6R6JZRFGeDP8G9sCawsKev95mnMlHUVNoCEJprj2CM6m1nqqwAIL1CEYI/T17lXsfWukfWlgS5B+cwiJQdr5m3zDCqEmWQQsJHTx25B8fEShlEUGNblP2b7AOMSJqD1Q8B1pkWzLzSuOH9buLAAvSeQdxwU7RNwJ3nIrGltET98teQwD5KKxnJT+kX/l5My3AJmwWCEQrBxypy44l7PBFXEajBVD9R9DwzKVmH0PNuwv2vweGYJzYg5mGsbHLzYi9BoZNzel0wCqwaEloXv02KYs4DsbaFd4jjjmL3fHW0AZbPHMhsaFG+yTQW/b6XM/eLy4uz6z4HCbNYzb2S6/DabRXM6u9IDybcPhwj8CLXLQdf1DXk45o=",
          end:
            "mjCBg2kNtOOLKTNAyV3ydDcSMMYrMswE1zIC7SBgoqkWO2O3dz59q0U8DIoqdU05YnKOD12q2cIrib2VLr+91h7ZP2h749f9HJUzhF17qPJucnqJzQdJ0rchDcAK5Yx+2eSrYSNyt1hClNzkL3H2OisO7fRspJ2LGrDuDHdWyD+Tt5JMZilTVLm76fhAI4omHxrYMTiD4XouQRKsdnuR7thWy1MzHBX2fW5eUVq5E9d8KNTKucJs9n+H/knAtUMtmF5b0LVzwcoaKQjRtYQ4/muZ3uZ/QPQR2wp8ku9ilFyG2zSadFZWlh66456SQvAfSsoYXOeq6457Z2A3lYN88Z+9uLd3dZJcX4JmP5T1n91Br7vY+b8dQINYzTp8uKff78Xr8Arab88VqWmI957cXjuX3sa0yh9eofFvkfIYOppydN6jXXq/ZN0eGoyBarwazen8NYUDyqddiuBmX5709UCWwaGAsqtXCAybic5AY8UqqUd8TyTn2gywMu9v0T7jqdSFGcco5biLoGFpPOjSYXNkGY2vb2jsPFUFqdHUv1hjQjtw7BBVJSpXniDXM3XzntTASZvuYO1ma9yCPvjQM6CiQE3cZ1vFDjIgAp6hxz7KVFG8XST0RGVmbyaKBWS+RpXsbQdSdo3BNp5mODKWBwUtYnHR4Dev1FKgag55KJQ=",
          author:
            "Km51ecJvGVqQ/V+PtgNg2rbERofS+2pTqs35mn9XfNP+SY/xy40AC0gowVyEn2vJwDI1NfwvB+A/nSp7af+BRoDh6Nw5PRAFIPyefEtx92zU1RNEtgl0Csf8Zw/x4X5UQ5hNjSR2VYTzDZUaEwElh0B/6ELn5ke6RJ6yhx9NlnsIFYcbOGIBaKQGxdUmyQ8SsfwOlf1//xhRb3o287LlWnFeI+OjSLJ9KqVIj9baMID/csiQcBW/uuEhQ6MRNmmhzK2Ksa8gT7h9/dBy+OAuhcv7bWC6Wc84fMl6hlrDbpiLC8ems4vLNeeYebdLhqi7eG+pkz2hlfkm58UdEwwXf/lVYUaWYSwHIv3oofOhW61nbp01WmPlZXZ8vx5Eto7GjtlC+UJMabnSf6Dk5+HCZKViti7dZq2Jy4HDGm2FLyqUmo+RoV0w8yRqFeWxngfsjpVJfaGo8yYhEtQxQTyB0+xDSWVCQd9un9WAs8EhLQjUg1sxZoOz+8PJ/BxIheUIw2GaI/CUUsAcioUhAYp0mAI3HDiJb/D7+cmhtEaPSOF8HBpQXTufi5ugO/l8jxm4p3zW3gwpKCa0hKffoxbyau/fxbYegw1xwvqnazG5YYBobo+JlQuwhnr/4ISSIjwf+StGXdfL8e7dFUCCUkeka3oL97QAgZ7XFhacoqsKgqI=",
          dbms:
            "Th7dKEaZ6+s7Ve4Ng5pPt6KCqdivA6qCAPUWpKKCfduEm4jPW3OCDJ2/Uq/iVUuBmHRtWsvn3C63cXpGrHcUbYfdUmdE6O2pfFL8Jk0zKMlMwjZ7UCQ2eodJiQQeolgWn1XZ7M/BHCpLPXzsepVRPN8MMSbXABNLEtglDjyPZGpMM93nz5mAf66/RHcZQCnvEHJwwq2amZVpJsSOeUKAQFEivCfWKjzE+MZBG+VaUrpW6mrX4fbPVmcNPDspJqAtCcWv3TmBa+7AN2sLnr4j33AKIs6Sr2izL99m9soWt75WoIgwsYsqTf8j8q7tiaMhIQ6la8U2b3WQv16rqSAw+U1zoXNG+526RVWHlgqxI6IwLLmy1knXP889oSxCdh+e2LIAGsoDMfwXNr+btooolbi7UnQWlGzBaR2p8yZ3SZAao17e6dUFp35RG2StjK2bE4bHAxmge8uDxrAPezvWi4gXH5ihpQ5SC9QtZRBdsgDyCfnMyO0RhNzGN/VlkGCFnroeTUFd0dswNPuGolmhg7eM1qzjWZS6Q10RHL465JxNtzmDhIv/J5IvLI4JPCuak04fgMzb8eRvkDLfSVVUvuCeGu9YCynJzRxwNMbDzkZ8nKVnnvjDePyZXYUT7EapTVREF3BHV/L5V1GwEH6RxOzTS786C1zkPYk7g+n5n+I=",
          language:
            "GfA8ALqlPahBVO2msGm0gyGMDXBuWLtgtwVurP79lsS+WhvSfTDQFIVnQwvn4FgFCM6l9dXEO7K6zEykTA7eet84bB9qzZqtlHGtcTjDgzmcwiyHxVGh4WcNXyb3iZvL9+nsctO/bVpddk99hOvJBT6pMhkidaQhuk5LT/qkxXttoUciGNgHCAWTVN0Ko1ksk3gdlUAyy5VBF61xcwqKBD74O6P0dZCENhyhngcF7TC2HfyMjjXVV6zV8QqnsYNoDOYd/udl376k7T1xrCb0YBQ6fmpI1oQTO02zImWAL41NXhWNyqJle0EdJsuWLVj5norrISd185n9kqhUuK3aHNB3RxvM4kA7Hf6D5YVu/AA4RJzzsc1yiPR80cnokzr98BLEL+SLbkCleWA9Qpj5MK/dAgnEpjGSgh+4cQ2p/4piwxg3AV6j+Dt7f9IlKDilC/NXrnQAlURbJ0GLi/+ZGPC27f4qK+4CaavAUM9szkozmNGIHUzBM7e/+M5PR142zdMOd2GXmagzR4B4KE0b0hOVcEaaKWzxXJ1SJCCmdykeIfb+PQ+DNwXSm91tuSZOxrh9ZynYDrIEylEI0N7zxuFzshuKA+Tn0aFCP3E/e6ECu6IkTBnARXEy48pCKxqql9hD5j3YW0aC32dgdD0HcIYVyj/02CYRYQn3m6HqPSA=",
          framework:
            "SYu0tR9P6EfyDu22IBdHLK5k6mxWLYkVcNMakFLoDGygZ4mfDfCVU7CGEJl0ix3GUdkpFcGWiMtSFTlpsc0S6GwjJkOJwlyggxks/iWsm8Ss1JPjYDwy80yPd/6WuQtJv6BYJKQOKU812oGtY3eTJ9PrLd0KeVduFb9Lzm6uI75h6lfhTaG+ZUOihLfzK+cdzOOv/tSU+l62VCMPHxuz3hSB1ApTGuM2uLGgfCf3QqgY4+cQQIUVIuXV3RD+7+myGYLJaRdRvFDtylLVeNo8ChEPHoyqYPP9+d2lOccTLndAUl5MBZjWsWfRSupFcykq2rx1cYn5A2WpyiT0q05x1k5EjTIlyadwpTtjQ8gYUtkGXlMMXcwXHyHx94lJaIVC4Fzzi5rmEU1NYRuFpu4r8r5MgzH0sGJd23HaLk0OCb4Vc4FYahD+DCWFHqBxrBIKzfZimsUfvIqS7+u0TG5MGJVwYf+X7oZcLDsgKoWlD+CaxfyceTr6ZuL5fb9LxNYLTrbjDSnJ1Gdp8/SWXgdyDBu1ni047j1iUQksXRsyLeYisAESL3QWd36fx+hslPY+hrUSOW464bP4urZp00651kp+QuYoG0otajSylWr0plGJMeWJMMvasznP/FjINy5qjn7/3fqdOt8sqfHnvaCb9s0+RG5Qqdxu7aOEVjF35A4=",
          fines: 1000,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("abouts", null, {});
  },
};
