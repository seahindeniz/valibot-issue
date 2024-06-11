import {
  type FieldValues,
  type FormErrors,
  type FormOptions,
  type PartialValues,
  type ValidateForm,
  createForm as createFormModular,
  validate,
} from '@modular-forms/solid';
import * as v from 'valibot';
import { watch } from './watch';

export function valiForm<TFieldValues extends FieldValues>(
  schema: v.GenericSchema,
  language: string
): ValidateForm<TFieldValues>
{
  return async (values: PartialValues<TFieldValues>) => {
    console.log('valiForm', values);

    const result = await v.safeParseAsync(schema, values, {
      abortPipeEarly: true,
      lang: language || 'en',
    });
    return result.issues
      ? result.issues.reduce<FormErrors<TFieldValues>>(
          (errors, issue) =>
            Object.assign(
              {
                [issue.path!.map(({ key }) => key).join('.')]: issue.message,
              },
              errors
            ),
          {}
        )
      : {};
  };
}

export function createForm<Schema extends FieldValues>(props: {
  schema: v.GenericIssue;
  locale: string;
  initialValues?: FormOptions<Schema>['initialValues'];
}) {
  const scope = createFormModular<Schema>({
    validate: valiForm(props.schema, props.locale),
    initialValues: props.initialValues,
  });
  const [form] = scope;

  watch(props.locale, () => {
    validate(form);
  });

  return scope;
}
