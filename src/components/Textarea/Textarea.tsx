import React, { useEffect } from 'react';

interface Props {
  data: string | undefined;
  valueUpdated: Function;
}

const Textarea = (props: Props) => {
  const textInput = React.createRef<HTMLTextAreaElement>();

  useEffect(() => {
    resizeTextArea(textInput.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resizeTextArea = (ref: HTMLTextAreaElement | null) => {
    if (ref) {
      ref.style.height = 'auto';
      ref.style.height = `${ref.scrollHeight}px`;
    }
  }

  const handleChange = (event: any) => {
    resizeTextArea(event.target);
    const data = event.currentTarget.value;
    props.valueUpdated(data);
  };

  return (
    <textarea
      ref={textInput}
      defaultValue={props.data}
      onChange={handleChange}
    />
  );
}

export default Textarea;