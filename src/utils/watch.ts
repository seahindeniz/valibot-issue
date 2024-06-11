import {
  type Accessor,
  type AccessorArray,
  type OnEffectFunction,
  type OnOptions,
  createEffect,
  on,
} from 'solid-js';

export function watch<Dependencies, Next extends Prev, Prev = Next>(
  dependencies: AccessorArray<Dependencies> | Accessor<Dependencies>,
  callback: OnEffectFunction<Dependencies, undefined | NoInfer<Prev>, Next>,
  options?: OnOptions
) {
  const optionsWithDefault = { defer: true, ...options };

  createEffect(
    // @ts-ignore
    on(dependencies, callback, optionsWithDefault)
  );
}
