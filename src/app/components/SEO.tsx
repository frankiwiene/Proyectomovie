import { Helmet } from "react-helmet-async";

export function SEO() {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>Filmario - Movie Review Website</title>
      <meta
        name="title"
        content="Filmario - Movie Review Website"
      />
      <meta
        name="description"
        content="Descubre, califica y comparte tus películas favoritas."
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content="https://frankiwiene.github.io/Proyectomovie/"
      />
      <meta
        property="og:title"
        content="Filmario - Movie Review Website"
      />
      <meta
        property="og:description"
        content="Descubre, califica y comparte tus películas favoritas."
      />
      <meta
        property="og:image"
        content="https://i.imgur.com/BbqnEaK.png"
      />

      {/* Twitter */}
      <meta
        property="twitter:card"
        content="summary_large_image"
      />
      <meta
        property="twitter:url"
        content="https://frankiwiene.github.io/Proyectomovie/"
      />
      <meta
        property="twitter:title"
        content="Filmario - Movie Review Website"
      />
      <meta
        property="twitter:description"
        content="Descubre, califica y comparte tus películas favoritas."
      />
      <meta
        property="twitter:image"
        content="https://i.imgur.com/BbqnEaK.png"
      />
    </Helmet>
  );
}
