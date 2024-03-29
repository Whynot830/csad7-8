import { Input, Button, Modal, ModalBody, ModalContent, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure, Textarea, ModalFooter } from '@nextui-org/react'
import './App.css'
import { useContext, useEffect, useState } from 'react'
import { EditIcon } from './components/EditIcon'
import { DeleteIcon } from './components/DeleteIcon'
import transition from './lib/transition'
import axios from 'axios'
import { AuthContext } from './components/AuthContext'
import Auth from './pages/Auth'

function App() {
  axios.defaults.withCredentials = true
  const url = 'http://localhost/api/products'
  const [products, setProducts] = useState([])
  const [forbiddenError, setForbiddenError] = useState(null)
  const { loggedIn, user, checkLoginState } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: ''
  })
  const [editableProductId, setEditableProductId] = useState(null)

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleModalOpen = (flag, product) => {
    setIsUpdating(flag)
    if (flag) {
      setNewProduct({ name: product.name, description: product.description })
      setEditableProductId(product.id)
    }
    onOpen()
  }
  const handleOnPress = () => {
    if (isUpdating) editProduct(editableProductId)
    else addProduct()
    handleOnClose()
  }
  const handleOnClose = () => {
    setNewProduct({ name: '', description: '' })
    if (forbiddenError) setForbiddenError(false)
    onClose()
  }
  const columns = [
    { name: 'ID', key: 'id' },
    { name: 'Name', key: 'name' },
    { name: 'Description', key: 'description' },
    { name: 'Created at', key: 'created_at' },
    { name: 'Created by', key: 'created_by' },
    { name: 'Actions', key: 'actions' }
  ]
  const getProducts = async () => {
    try {
      const { data: products } = await axios.get(url)
      transition(() => setProducts(products))
    } catch (err) {
      console.log(err);
    }
  }
  const addProduct = async () => {
    transition(() => setIsLoading(true))
    try {
      const response = await axios.post(url, newProduct)
      if (response.status === 200) {
        getProducts()
        const div = document.getElementById('content')
        div.scrollTo({ top: div.scrollHeight, behavior: 'smooth' })
      }
    } catch (err) {
      console.log(err);
    }
    finally { transition(() => setIsLoading(false)) }
  }
  const editProduct = async (productId) => {
    transition(() => setIsLoading(true))
    try {
      const response = await axios.put(`${url}/${productId}`, newProduct)
      if (response.status === 200) {
        getProducts()
      }
    } catch (err) {
      setForbiddenError(true)
      transition(() => onOpen())
      console.log(err);
    } finally { transition(() => setIsLoading(false)) }
  }
  const deleteProduct = async (productId) => {
    transition(() => setIsLoading(true))
    try {
      const response = await axios.delete(`${url}/${productId}`)
      if (response.status === 204)
        getProducts()
    } catch (err) {
      setForbiddenError(true)
      onOpen()
      console.log(err);
    } finally {transition(() => setIsLoading(false))}
  }
  const logout = async () => {
    try {
      const response = await axios.post('http://localhost/api/auth/logout')
      if (response.status === 204)
        checkLoginState()
    } catch (err) {
      console.log(err);
    }

  }
  useEffect(() => {
    getProducts()
  }, [])


  return (
    <div id='content' className="flex flex-col items-center h-full p-6 overflow-auto">
      {loggedIn && user && (
        <>
          <div className="flex gap-x-3 items-center mb-5">
            <span>{`You are logged in as ${user.username}`}</span>
            <Button onPress={logout}>Logout</Button>
          </div>

          <Table aria-label='Product table' className='max-w-[800px]'>
            <TableHeader columns={columns}>
              {(column) =>
                <TableColumn key={column.key}>
                  <span className="text-base">{column.name}</span>
                </TableColumn>
              }
            </TableHeader>
            <TableBody items={products} emptyContent={"Product table is empty"}>
              {(product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{new Date(product.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{product.user.username}</TableCell>

                  <TableCell>
                    <div className="relative flex items-center gap-2">

                      <Tooltip content={`Edit product '${product.name}'`}>
                        <span className="text-xl text-default-400 cursor-pointer active:opacity-50">
                          <EditIcon onClick={() => { handleModalOpen(true, product) }} />
                        </span>
                      </Tooltip>
                      <Tooltip color="danger" content={`Delete product '${product.name}'`}>
                        <span className="text-xl text-danger cursor-pointer active:opacity-50">
                          <DeleteIcon onClick={() => { deleteProduct(product.id) }} />
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Button onPress={() => { handleModalOpen(false) }} isIconOnly radius='full' size='lg' className='absolute bottom-24 right-24 z-10 text-xl'>+</Button>
          <Modal placement='center' isOpen={isOpen} onClose={handleOnClose}>
            <ModalContent>
              <ModalHeader>{isUpdating ? 'Update product' : 'Add Product'}</ModalHeader>
              {!forbiddenError ?
                <>
                  <ModalBody>
                    <Input autoFocus
                      label="Name"
                      isRequired
                      value={newProduct.name}
                      onValueChange={(value) => setNewProduct({ ...newProduct, name: value })}
                    />
                    <Textarea
                      label="Description"
                      isRequired
                      value={newProduct.description}
                      onValueChange={(value) => setNewProduct({ ...newProduct, description: value })}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button isDisabled={isLoading || newProduct.name.trim() === '' || newProduct.description.trim() === ''}
                      onPress={handleOnPress}
                    >{isUpdating ? 'Update' : 'Add'}</Button>
                  </ModalFooter>
                </>
                :
                <>
                  <ModalBody>This action is not available for you</ModalBody>
                  <ModalFooter>
                    <Button onPress={handleOnClose}>OK</Button>
                  </ModalFooter>
                </>

              }
            </ModalContent>
          </Modal>

        </>
      )}
      {!loggedIn && <Auth />}
    </div >
  )
}

export default App
