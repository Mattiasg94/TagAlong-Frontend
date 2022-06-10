import React from "react";
import { useSelector } from "react-redux";
import useSWR from 'swr';
import { fetcher } from "./utils/axios";
import { User } from "./types";
import { RootState } from "./store";
import {url} from '../src/routes';

const FetchCurrentUser = () => {
  const account = useSelector((state: RootState) => state.auth.account);
  const user = useSWR<User>(`${url}api/user/${account?.id}/`, fetcher)
  return user.data!
};

export default FetchCurrentUser;