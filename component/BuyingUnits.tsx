'use client'
import { SetLoading } from '@/redux/loadersSlice'
import { Button, Form, Image, Input, Tooltip, message } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons'

function NewUnits() {
    const dispatch = useDispatch()
    const [imageUrl, setImageUrl] = useState('')

    const handleSubmit = async (code: string) => {
        try {
            dispatch(SetLoading(true))
            // Perform the product code check here
            //   const productCode = values?.target?.value || '';

            const response = await axios.get(`api/products/check?code=${code}`)

            const url = response.data.data.productImage
            console.log(url)

            setImageUrl(url)
            setAddUnits(false)
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Something went wrong')
        } finally {
            dispatch(SetLoading(false))
        }
    }

    const [addUnits, setAddUnits] = useState(false)

    const onShowUnits = () => {
        setAddUnits(true)
    }

    const onHideUnits = () => {
        setAddUnits(false)
        setImageUrl('')
        // onHide()
    }

    const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit(event.currentTarget.value)
        }
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Add any additional logic here
    }

    const onHideBuyingUnits = () => {
        setImageUrl('')
    }

    const onFinish = async (values: any) => {
        try {
            dispatch(SetLoading(true))
            console.log('NewUnits.tsx onFinish', values)
            const response = await axios.post('api/products/recording?buying=1', values)
            console.log(response)
            if (response.data.success === true) {
                message.success(response.data.message)
            }
            else {
                message.error(response.data.message || "Something Went Wrong!")
            }
            setImageUrl('')
        } catch (error: any) {
            // console.log(error)
            message.error( 'Something went wrong')
        } finally {
            dispatch(SetLoading(false))
        }
    }
    return (
        <div>
            <Form
                layout='vertical'

                onFinish={onFinish}
            >
                <div className="flex justify-center">
                    <Form.Item label="Product Code" name='code' className='lg:w-1/4 sm:w-1/2 md:w-1/3'>
                        <Input 
                            placeholder="#A0005" 
                            onPressEnter={handleEnterPress} 
                            suffix={
                                <Tooltip title="Press Enter Key after entering...">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                </div>
                <div className="flex justify-center ">
                    <div className='lg:w-1/4 sm:w-1/2 md:w-1/3'>
                        {/* {imageUrl && <BuyingUnits imageUrl={imageUrl} onHide={onHideBuyingUnits} />} */}
                        {imageUrl &&
                            <div className='flex flex-col items-center'>
                                <div className='flex flex-col items-center w-auto' >
                                    <p>Is this product?</p>
                                    <Image
                                        src={imageUrl}
                                        className='w-auto'
                                    />
                                </div>
                                <div className='flex flex-row items-center'>
                                    <Button type="primary" style={{ margin: '10px' }} onClick={onShowUnits}>Yes</Button>
                                    <Button type="default" style={{ margin: '10px' }} onClick={onHideUnits}>No</Button>
                                </div>

                                <div className=' w-auto'>
                                    {addUnits &&
                                        <div>
                                            <Form.Item label="Units Buy" name='units' className=' w-auto my-3'>
                                                <Input placeholder="123" />
                                            </Form.Item>
                                            <Form.Item label="Price per Unit" name='pricePerUnit' className='my-3'>
                                                <Input placeholder="123" />
                                            </Form.Item>

                                            <Button type='primary' htmlType='submit' className='my-3' block>Confirm</Button>
                                        </div>
                                    }
                                </div>

                            </div>
                        }
                    </div>

                </div>
            </Form>

        </div>
    )
}

export default NewUnits