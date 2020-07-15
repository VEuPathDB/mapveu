/**
 * DKDK: There may be a better custom hook code/library than my implementation, but this still works
 */

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useRequest(url) {
  // hoos for loading, response, error
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // will run when rendering and changing url
  // Warning message was shown:
  // "It looks like you wrote useEffect(async () => ...) or returned a Promise.
  // Instead, write the async function inside your effect and call it immediately:"
  useEffect(
    () => { // Warning message recommends to use like this
        async function fetchData() {
            setError(null); // set error state
            try {
                setLoading(true); // set loading state to display message/image like loading...
                const res = await axios.get(url, { headers: {
                    // add headers here,if necessary
                    // 'Access-Control-Allow-Origin': '*',
                    // 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    }}); // axios call
                setResponse(res); // set response state
            } catch (e) {
                setError(e); // set error state
            }
            setLoading(false); // set loading to false for not displaying loading message/image
        }
        fetchData();    // Warning message recommends to call this function here
    }, [url]
  ); // only execute this useRequest when changing url

  return [response, loading, error]; // return state variables
}
