import React from 'react';
import {Table, Container, Row, Col} from 'react-bootstrap';
import {Button, IconButton, Paper, Typography, CircularProgress} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {green, red} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import {useTranslation} from 'react-i18next';
import clsx from 'clsx';

import Ctx from '../context';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    buttonError: {
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[700],
        },
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

const CartComponent = (props) => {
    const {cart, inc, dec, deleteFromCart, cleanUp, user} = React.useContext(Ctx);
    const [sum, setSum] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const {t} = useTranslation();
    const classes = useStyles();

    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
        [classes.buttonError]: error
    });

    React.useEffect(() => {
        let arr = cart.map(item => item.fullPrice);
        if (arr.length) {
            let sumOfArr = arr.reduce((out, current) => out + current);
            setSum(sumOfArr.toFixed(2));
        }
    }, [props.cart]);

    const incItem = (event, id) => {
        event.preventDefault();
        inc(id);
    };

    const decItem = (event, id) => {
        event.preventDefault();
        dec(id);
    };

    const remove = (event, id) => {
        event.preventDefault();
        deleteFromCart(id);
    };

    const doCleanUp = (event) => {
        event.preventDefault();
        cleanUp();
    };

    const send = event => {
        event.preventDefault();

        if (!loading) {
            setLoading(true);
            setSuccess(false);
            setError(false);
            const data = {};

            const items = cart.map(item => [item.id, item.count]);
            const token = 'Bearer ' + localStorage.getItem('Token');

            data.items = items;
            data.id = user.id;

            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                method: 'POST',
                body: JSON.stringify(data)
            };

            fetch('/api/order', options)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('error while sending order')
                    }

                    setSuccess(true);
                    setTimeout(() => {
                        props.toggleCart(false);
                        cleanUp();
                    }, 2000);
                    return res;
                })
                .catch(e => {
                    setError(true);
                    console.error(e)
                })
                .finally(() => setLoading(false));
        }
    };

    if (cart.length <= 0) {
        return (
            <React.Fragment>
                <Container>
                    <Row className='justify-content-center mt-5 pt-5'>
                        <h3>{t('have no items')}</h3>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <Container>
                <Row className='justify-content-center'>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>{t('Title')}</th>
                            <th>{t('Amount')}</th>
                            <th>{t('Price')}</th>
                            <th><Button variant='outlined' color='secondary' size='small'
                                        onClick={event => doCleanUp(event)}>{t('Clean Up')}</Button></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            cart.map((item, index) => <tr key={index}>
                                <td>{item.title}</td>
                                <td><Button size="small" aria-label="dec"
                                            onClick={event => decItem(event, item.id)}>-</Button>{item.count}<Button
                                    size="small" aria-label="inc" onClick={event => incItem(event, item.id)}>+</Button></td>
                                <td>${item.fullPrice}</td>
                                <td><IconButton size="small" aria-label="Delete"
                                                onClick={event => remove(event, item.id)}><DeleteIcon/></IconButton>
                                </td>
                            </tr>)
                        }
                        </tbody>
                    </Table>
                </Row>
                <Row>
                    <Col md={8} className='align-content-center'>
                        <div className="m-2">
                            <Paper className={classes.root}>
                                <Typography>{t('Total amount of your order')} - ${sum}</Typography>
                            </Paper>
                        </div>
                    </Col>
                    <Col md={4} className='text-right align-self-center'>
                        <div className={classes.wrapper}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={buttonClassname}
                                disabled={loading}
                                onClick={event => send(event)}
                            >
                                {t('Order')}
                            </Button>
                            {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                        </div>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
};

export default CartComponent;
