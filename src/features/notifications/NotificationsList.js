import React, { useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classNames from 'classnames';
import {
  selectAllNotifications,
  allNotificationsRead,
} from './notificationsSlice'
import { selectAllUsers } from '../users/usersSlice'

export const NotificationsList = () => {
  const dispatch = useDispatch()
  const users = useSelector(selectAllUsers)
  const notifications = useSelector(selectAllNotifications)

  // используем хук useLayoutEffect для того, чтобы избежать кратковременного мерцания старых данных, которое возникнет,
  // если мы вместо этого хука попробуем использовать хук useEffect (сначала отрисуются старые данные, потом будет
  // применён "эффект" отмечания уведомлений как прочитанных, произойдёт изменение стейта и будет повторная перерисовка)
  // если я правильно понял, useLayoutEffect отработает синхронно перед второй отрисовкой, то есть он является блокирующим рендеринг, что
  // нужно иметь в виду и применять осторожно!
  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  // так как нам на каждой итерации генерации JSX'а для уведомления нужен ряд подготовительных действий, то
  // можно эту подготовительную работу проделать отдельно и результат записать в renderedNotifications
  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find((user) => user.id === notification.user) || {
      name: 'Unknown User',
    }

    const notificationClassname = classNames('notification', {
      new: notification.isNew
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
