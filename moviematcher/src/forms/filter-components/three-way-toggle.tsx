import {
    FormLabel,
    RadioGroup,
    Radio,
    Stack,
} from '@chakra-ui/react'

interface Props {
    genre: string;
    genreId: string;
    onChangeFunc: (value:string, callBackString:string, id: string, sent: boolean) => void;
    value:string;
}

const ThreeWayToggle:React.FC<Props> = ({genre, genreId, onChangeFunc, value}) => {

  return (
    <>
      <FormLabel htmlFor={genre} size='sm' mb='0'>
        {genre}
      </FormLabel>
      <RadioGroup onChange={(val)=> {
          onChangeFunc(val, `set${genre}`, genreId, false)
        }} value={value} id={genre}>
        <Stack direction='row'>
          <Radio size='sm'  colorScheme='red' value='-'></Radio>
          <Radio size='sm' value='na'defaultChecked={true}></Radio>
          <Radio size='sm' colorScheme='green' value='+'></Radio>
        </Stack>
      </RadioGroup>
    </>
  );
};

export default ThreeWayToggle;