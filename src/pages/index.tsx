import React from 'react';
import Head from 'next/head';
import styles from "@/styles/Home.module.css";
import ChessGame from '@/comonents/ChessGame';

export default function App() {

  return (
    <>
      <Head>
        <title>Chess Game</title>
        <meta name="description" content="Chess game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.chessboard}>
        <ChessGame/>
      </main>
    </>
  );
}
