import type { AppProps } from "next/app"
import Head from "next/head"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bibliography Builder</title>
        <meta name="description" content="Build formatted bibliographies from CSL-JSON files" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="stylesheet" href="https://unpkg.com/almond.css@latest/dist/almond.lite.min.css" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
