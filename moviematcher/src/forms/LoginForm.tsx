import {useState, useEffect} from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  FormLabel,
  FormControl,
  InputLeftElement,
  InputGroup,
  Input,
  ModalHeader,
  Avatar } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks';
import { FaLock, FaUserAlt} from 'react-icons/fa';
import { selectLogin, turnOffLogin } from '../redux/features/modals/loginSlice';
import { turnOnCreateAccount } from '../redux/features/modals/createAccountSlice';
import { useAppSelector, useAppDispatch } from '../redux/app/hooks';
import { setToken, selectAuth } from '../redux/features/modals/authSlice';
import APIService from '../services/APISevice'
import './LoginForm.css'



const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const open = useAppSelector(selectLogin);
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(open) {
      onOpen()
    }
  }, [open])

  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await APIService.userLogin(username, password)
    if (response.confirmed) {
      const authToken = response.accessToken;
      await dispatch(setToken(authToken));
      handleClose();
      //redirect user or have a modal pop up to confirm log in
    } else {alert('invalid username or password')}
    setUsername('');
    setPassword('');
    }

    
  const handleClose = () => {
    dispatch(turnOffLogin());
    onClose();
  }

  const handleCreateAccount = () => {
    dispatch(turnOnCreateAccount());
    handleClose();
  }

  return (
    <Modal isOpen={isOpen}  onClose = {handleClose} isCentered>
      <ModalOverlay/>
      <ModalContent style={{borderRadius:'2rem'}}>
      <ModalHeader bgColor='navy' color='white'  style={{display:'flex', flexDirection:'column', 
                    justifyContent:'center', alignItems:'center', borderTopLeftRadius:'2rem', borderTopRightRadius:'2rem'}}>
              <Avatar size='lg' bg='navy'/>
              <div> Log In! </div>
      </ModalHeader >
      <form onSubmit = {(e:React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <ModalBody pb={6}>
            <FormControl isRequired>
                <FormLabel forhtml='username'> Username  </FormLabel>
                <InputGroup>
                  <InputLeftElement
                      pointerEvents="none"
                      children={<FaUserAlt color="gray.300" />}
                    />
                  <Input 
                    autoFocus
                    errorBorderColor="red.300"  
                    name='username' 
                    placeholder='Enter your username' 
                    value = {username} 
                    onChange = {(e:React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}>
                  </Input>
                </InputGroup> 
              </FormControl>
              <FormControl isRequired>
                <FormLabel forhtml='password'>Password </FormLabel>
                <InputGroup>
                  <InputLeftElement
                      pointerEvents="none"
                      children={<FaLock color="gray.300" />}
                    />
                  <Input 
                    type='password'
                    errorBorderColor="red.300"  
                    name='password' 
                    placeholder='Enter your password' 
                    value = {password} 
                    onChange = {(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}>
                  </Input>
                </InputGroup> 
              </FormControl>
            </ ModalBody>
            <ModalFooter >
              <div className='modal-footer'> 
                <div className='create-account-button-container'> 
                  <Button mr={3} onClick={handleCreateAccount}> Create Account </Button>
                </div>
                <Button mr={3} type='submit'> Log In </Button>
              </div>
            </ModalFooter>
          </form>
        </ModalContent>
    </Modal>
  )
}

export default LoginForm
