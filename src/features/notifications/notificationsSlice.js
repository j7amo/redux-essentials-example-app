import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  // вот здесь очень интересный момент, который является особенностью поведения payload creator коллбэка
  // дело в том, что здесь по умолчанию передаётся специальный объект thunkAPI, который обладает свойствами:
  // 1) dispatch, getState - известные уже методы
  // 2) extra - экстра-аргумент - как правило это некий API(например, axios), который знает как работать с сервером
  // и таким образом, берущий на себя эту логику вместо прямого размещения её в thunk'е (более декларативный подход)
  // 3) и всякие дополнительные штуки...
  // таким образом мы используем деструктуризацию и достаём всё, что нам надо из этого объекта
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    // вот здесь я сначала немного смутился, но потом вспомнил деструктуризацию значений из массива (что используется реже,
    // чем деструктуризация объектов имхо): идея в том, что можно левую часть выражения писать в виде массива и определённым
    // образом размещать там нужные нам идентификаторы, в которые мы в итоге и записываем значения из массива в правой части
    // например, при такой записи const [,,,someVar] = [1, 2, 3, 4] someVar будет в итоге присвоено значение 4
    const [latestNotification] = allNotifications
    // берём таймстэмп у самого свежего уведомления
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    // этот таймстэмп нам нужен, чтобы обратиться к API для получения действительно свежих уведомлений
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    // обрати внимание: этот thunk в конечном счёте возвращает уже готовые данные (не промис)
    return response.data
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    // редьюсер на случай "отметить все как прочитанные"
    allNotificationsRead(state, action) {
      state.forEach((notification) => {
        notification.read = true
      })
    },
  },
  // наблюдение: идентификатор extraReducers может быть как
  // 1) функцией (extraReducers(builder) {builder.addCase(...)})
  // 2) так и  объектом (extraReducers: [...]: () => {...})
  // это разные случаи и они используют разный синтаксис для описания того, как реагировать на экшены
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, { payload }) => {
      state.push(...payload)
      state.forEach(notification => {
        // отметить все уведомления как новые, если они не прочитаны
        notification.isNew = !notification.read
      })
      // сортируем наши уведомления по дате: свежие - в начале списка
      state.sort((a, b) => b.date.localeCompare(a.date))
    },
  },
})

export default notificationsSlice.reducer

export const { allNotificationsRead } = notificationsSlice.actions

export const selectAllNotifications = (state) => state.notifications
