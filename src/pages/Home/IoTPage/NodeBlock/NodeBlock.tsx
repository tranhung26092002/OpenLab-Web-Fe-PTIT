import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { Card, Row, Col, Input, Button, List, Pagination, AutoComplete } from 'antd';
import Header from '../../../../components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../../../redux/configStore';
// import { fetchAllBaiIoT, fetchBaiIoTPaginated, searchBaiIoT } from '../../../../redux/BaiIoT/BaiIoTReducer';
import { debounce } from 'lodash';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchAllBaiKhoiCamBien, searchBaiKhoiCamBien } from '../../../../redux/NodeBlockReducer/NodeBlockReducer';
import Footer from '../../../../components/Footer/Footer';

export interface SourceBlock {
    data: [];
}

const SensorBlock = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch<DispatchType>();
    const data = useSelector((state: RootState) => state.SensorBlockReducer.items);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const searchResults = useSelector((state: RootState) => state.SensorBlockReducer.searchResult) as any;
    const itemsToDisplay = useMemo(() => {
        return searchTerm ? (searchResults.data || []) : currentItems;
    }, [searchTerm, searchResults, currentItems]);

    const totalItemsToDisplay = searchTerm ? (searchResults.data ? searchResults.data.length : 0) : data.length;
    // console.log("searchResults", searchResults);
    const debouncedSearch = debounce((term) => {
        if (term) {
            dispatch(searchBaiKhoiCamBien(term));
        }
    }, 500)

    const handleSearch = (value: any) => {
        setSearchTerm(value);
        setCurrentPage(1);
        debouncedSearch(value);
    }

    const navigate = useNavigate();

    const handleDetailClick = (id: number) => {
        navigate(`/home/IoTNode/detailNode?idNode=${id}`);
    }

    useEffect(() => {
        dispatch(fetchAllBaiKhoiCamBien());
    }, [dispatch]);

    return (
        <Fragment>
            <Header />
            <div className="container" style={{ marginTop: '150px' }}>
                <Row gutter={16}>
                    <Col span={18}>
                        <h4 className='text-center'>DANH SÁCH BÀI THỰC HÀNH LỚP THIẾT BỊ</h4>
                        <List
                            itemLayout="horizontal"
                            dataSource={Array.isArray(itemsToDisplay) ? itemsToDisplay : []}
                            renderItem={item => (
                                <Card style={{ width: '100%', marginTop: 16 }}>
                                    <Row align="middle" gutter={16}>
                                        <Col span={6}>
                                            <img src={item.anhCamBien} alt={item.anhCamBien} style={{ width: '100%' }} />
                                        </Col>
                                        <Col span={18}>
                                            <h5>{item.tenCamBien}</h5>
                                            <Button onClick={() => handleDetailClick(item.camBienId)}>
                                                Chi Tiết
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            )}
                        />
                    </Col>
                    {/* Search Column */}
                    <Col span={6}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <h4>Tìm kiếm</h4>
                            <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                <AutoComplete
                                    style={{ flex: 1 }}
                                    placeholder="Tìm kiếm bài IoT..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </Col>


                </Row>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '20px'
                    }}>
                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={totalItemsToDisplay}
                        onChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div >
            <Footer />
        </Fragment >
    );
}

export default SensorBlock;
