import React, { Fragment } from 'react'
import styles from './Footer.module.scss'

type Props = {}

const Footer = (props: Props) => {
    return (
        <Fragment>
            <div className={styles.footer}>
                <div className={styles.footer_action}>
                    <div className={styles.container}>
                        <div className={`${styles.column} ${styles.one} ${styles.column_column}`}>
                            <div className={styles.tit}>
                                <span style={{ textAlign: 'center', fontSize: 17, marginTop: 20, color: '#000' }}>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.widgets_wrapper}>
                    <div className={styles.container}>
                        <div className="column one-fourth">
                            <aside id="text-2" className="widget widget_text">
                                <div className="textwidget"><span style={{ fontSize: 15, color: '#000' }}>Trụ sở chính:<br />
                                    122 Hoàng Quốc Việt, Q.Cầu Giấy, Hà Nội.<br /><br />
                                    Cơ sở đào tạo tại Hà Nội:<br />
                                    Km10, Đường Nguyễn Trãi, Q.Hà Đông, Hà Nội</span></div>
                            </aside>
                        </div>
                        <div className="column one-fourth"><aside id="text-3" className="widget widget_text">			<div className="textwidget"><span style={{ fontSize: 15, color: '#000' }}>Học viện cơ sở tại TP. Hồ Chí Minh:<br />
                            11 Nguyễn Đình Chiểu, P. Đa Kao, Q.1 TP Hồ Chí Minh<br /><br />
                            Cơ sở đào tạo tại TP Hồ Chí Minh:<br />
                            Đường Man Thiện, P. Hiệp Phú, Q.9 TP Hồ Chí Minh</span></div>
                        </aside>
                        </div>
                        <div className="column one-fourth"><aside id="text-4" className="widget widget_text">			<div className="textwidget"><div className="dvtv">
                            <ul style={{ listStyle: 'square' }}>
                                <li style={{ color: '#000' }}><a className='text-decoration-none text-dark' href="http://tracuuvanbang.ptit.edu.vn/" target="_blank">Tra cứu bằng tốt nghiệp</a></li>
                                <li style={{ color: '#000' }}><a className='text-decoration-none text-dark' href="#">Các đơn vị thành viên</a></li>
                                <li style={{ color: '#000' }}><a className='text-decoration-none text-dark' href="http://jstic.ptit.edu.vn/index.php/jstic/index" target="_blank">Tạp chí Khoa học Công nghệ</a></li>
                                <li style={{ color: '#000' }}><a className='text-decoration-none text-dark' href="http://portal.ptit.edu.vn/ba-cong-khai/">Ba công khai</a></li>
                            </ul>
                            <a href="https://www.facebook.com/HocvienPTIT" target="_blank"><img src="https://portal.ptit.edu.vn/wp-content/uploads/2016/06/facebook-thao.png" style={{ paddingTop: 6 }} /></a>
                        </div>
                        </div>
                        </aside>
                        </div>
                        <div className="column one-fourth">
                            <aside id="text-5" className="widget widget_text">
                                <div className="textwidget">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4430.156035754973!2d105.78456683308819!3d20.980514790166218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdcf7b0bd1%3A0xc1cf5dd00247628a!2zSOG7jWMgVmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IENow61uaCBWaeG7hW4gVGjDtG5n!5e0!3m2!1svi!2s!4v1491884697566" frameBorder={0} style={{ border: 0 }} allowFullScreen />
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
                <div className={styles.red_line}></div>
            </div>
        </Fragment>
    )
}

export default Footer;