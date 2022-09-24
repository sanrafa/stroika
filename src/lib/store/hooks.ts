import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";
import memoize from "proxy-memoize";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const createProxySelectorHook = <TState extends object = any>() => {
  const useProxySelector = <TReturnType>(
    fn: (state: TState) => TReturnType,
    deps: React.DependencyList
  ): TReturnType => {
    return useSelector(
      useCallback<(state: TState) => TReturnType>(memoize(fn), deps)
    );
  };
  return useProxySelector;
};

export const useProxySelector = createProxySelectorHook<RootState>();
