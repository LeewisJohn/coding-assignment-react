import { ChangeEvent, useEffect, useState } from 'react';
import RTAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';
import WithLabel from './WithLabel';

interface Props extends TextareaAutosizeProps {
  label: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaInput = (props: Props) => {
  const { label, defaultValue, className, maxLength = 0, onChange, ...PROPS } = props;
  const [value, setValue] = useState(defaultValue as string);

  return (
    <WithLabel label={label ?? ''} labelClass={`sm:ml-3 ${label === 'Title' ? 'sm:hidden' : ''}`}>
      <>
        <RTAutosize
          data-testid='text-area-input'
          className={`border-stale-100 h-fit w-full resize-none rounded-[3px] border-2 px-3 py-1 text-gray-800 outline-none hover:bg-[#f4f5f7] focus:border-chakra-blue sm:border-transparent sm:py-2 ${className ?? 'font-medium'
            }`}
          minRows={1}
          {...PROPS}
          defaultValue={defaultValue}
          onChange={(e) => {
            setValue(e.target.value);
            onChange?.(e);
          }}
        />
        {value && value !== defaultValue && (
          <>
            <hr className='mx-3 mt-[14px] mb-2 border-t-[.5px] border-gray-400' />
            <div className='relative flex justify-end'>
              <span
                className={`absolute -top-7 right-0 text-sm italic  ${value.length > maxLength ? 'text-red-400' : 'text-gray-800'
                  }`}
              >
                {value.length > maxLength ? (
                  'max length exceeded'
                ) : (
                  <>{maxLength - value.length} characters left</>
                )}
              </span>
            </div>
          </>
        )}
      </>
    </WithLabel>
  );
};

export default TextareaInput;
