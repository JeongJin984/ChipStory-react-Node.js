import React, { useCallback } from 'react'
import Link from 'next/link'
import { Skeleton, Switch, Card, Avatar, Button } from 'antd'
import { StarOutlined, CreditCardOutlined, SmileOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { LOG_OUT_REQUEST } from '../reducers/user'
import { POST_LOG_OUT_SUCCESS } from '../reducers/post'
import { backURL } from '../config/config'

const { Meta } = Card;
const prod = (process.env.NODE_ENV === 'production')

const IconText = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);

const userProfile = () => {

  const dispatch = useDispatch()
  const onClickLogOutButton = useCallback(
    () => {
      dispatch({
        type: LOG_OUT_REQUEST
      })
      dispatch({
        type: POST_LOG_OUT_SUCCESS
      })
    },
    [],
  )
  const { me }  = useSelector(state => state.user)

	return(
		<div style={ {alignContent:"center", padding: 20} }>
			<Card
        actions={[
          <IconText icon={CreditCardOutlined} text={me.Posts.length+' posts'} key="post"></IconText>,
          <IconText icon={StarOutlined} text={me.Followings.length+' following'} key="following"></IconText>,
          <IconText icon={SmileOutlined} text={me.Followers.length+' follower'} key="follower"></IconText>
        ]}>
        <Skeleton loading={false} avatar active>
          <Meta
            avatar={
              <Avatar 
                src={me.ProfileImages.length === 0 ? null : 
                      (prod ? `${me.ProfileImages[me.ProfileImages.length - 1].src}` : 
                        `${backURL}/profile/${me.ProfileImages[me.ProfileImages.length - 1].src}`)} 
                size={50}
              />
            }
            title={<span style={{fontSize: 18}}>{me.userId}</span>}
            description={me.introduction}
          />
        </Skeleton>
      </Card>
      <Button type="link" onClick={onClickLogOutButton}><Link href="/"><a>LogOuts</a></Link></Button>
		</div>
	)
}

export default userProfile