import Head from "next/head"
import type { AppProps } from "next/app"

import "almond.css/dist/almond.min.css"

import { UpdateNotification } from "../components/UpdateNotification"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bibliography Builder</title>
        <meta name="description" content="Build formatted bibliographies from CSL-JSON files" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <Component {...pageProps} />
      <UpdateNotification />
    </>
  )
}

export default MyApp
