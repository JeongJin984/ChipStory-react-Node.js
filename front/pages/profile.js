import React, { useCallback, useState } from 'react'
import { Skeleton, Switch, Card, Avatar } from 'antd';
import { SmileTwoTone, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import ProfileForm from '../components/ProfileForm'

const { Meta } = Card;

const IconText = ({ icon, text }) => (
  <span style={{ width:60 }}>
		<span style={{ fontSize: 20, fontWeight: 600}}>{text+' '}</span>
		<span style={{ fontSize: 15 }}>{icon}</span>
  </span>
);

const profile = () => {
	const { me, isLoggedIn} = useSelector(state => state.user)
	const dispatch = useDispatch()
	const [modifyProfileForm, setModifyProfileForm] = useState(false)
	
	const onClickProfileImage = useCallback(
		() => {
			setModifyProfileForm(prev => !prev)
		},
		[modifyProfileForm],
	)
	return(
		<div>
			{isLoggedIn ? 
				<Card
					style={{ marginTop: 16 }}
					actions={[
						<IconText icon={'posts'} text={me.Posts.length}/>,
						<IconText icon={'follwers'} text={me.Followers.length}/>,
						<IconText icon={'followings'} text={me.Followers.length}/>
					]}
				>
					<Skeleton loading={false} avatar active>
						<Meta
							avatar={
								<button style={{ border: 'none', backgroundColor:'transparent', cursor: 'pointer'}} onClick={onClickProfileImage}>
									<Avatar src={me.ProfileImages.length === 0 ? null : `http://localhost:3065/profile/${me.ProfileImages[me.ProfileImages.length - 1].src}`} size={80}/>
								</button>
							}
							title={<span style={{fontSize: 30}}>{me.userId}</span>}
							description={<span style={{fontSize: 20}}>{me.introduction}</span>}
						/>
					</Skeleton>
				</Card>
				:
				null
			}
			{
				modifyProfileForm  ?
					<ProfileForm/> :
					null
			}
		</div>
	)
}

export default profile