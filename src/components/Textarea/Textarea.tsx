import React from 'react';

interface Props {
  data: string | undefined;
  valueUpdated: Function;
}

class Textarea extends React.Component<Props, any> {
  textInput: React.RefObject<HTMLTextAreaElement>;

  constructor(props: Props) {
    super(props);
    this.textInput = React.createRef<HTMLTextAreaElement>();
  }

  componentDidMount() {
    this.resizeTextArea(this.textInput.current);
  }

  resizeTextArea = (ref: HTMLTextAreaElement | null) => {
    if (ref) {
      ref.style.height = 'auto';
      ref.style.height = `${ref.scrollHeight}px`;
    }
  }

  handleChange = (event: any) => {
    this.resizeTextArea(event.target);
    const data = event.currentTarget.value;
    this.props.valueUpdated(data);
  };

  render() {
    return (
      <textarea
        ref={this.textInput}
        defaultValue={this.props.data}
        onChange={this.handleChange}
      />
    );
  }
}

export default Textarea;