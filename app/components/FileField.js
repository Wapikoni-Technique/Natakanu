import React from 'react';
import { Field } from 'formik';

export default function FileField({ id, className, ...props }) {
  return (
    <Field {...props}>
      {({ field: { name, onChange } }) => (
        <input
          type="file"
          id={id}
          name={name}
          className={className}
          onChange={e => {
            const { target } = e;
            // Formik expects change events with a target
            // We'll intercept the `value` field of the input
            // Instead we'll return the pat of the first file within it
            const targetProxy = new Proxy(target, InterceptValue);
            e.target = targetProxy;
            onChange(e);
          }}
        />
      )}
    </Field>
  );
}

const InterceptValue = {
  get: (target, prop) => {
    if (prop !== 'value') return target[prop];
    const { files } = target;
    if (!files || !files.length) return '';
    return files[0].path;
  }
};
