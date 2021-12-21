import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
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

// так как мы хотим уведомления хранить упорядоченно по дате / времени, то не забываем передать функцию в качестве
// значения ключа sortComparer
const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})
const initialState = notificationsAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // редьюсер на случай "отметить все как прочитанные"
    allNotificationsRead(state, action) {
      Object.values(state).forEach((notification) => {
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
      // в старой редакции (до нормализации) мы работали со стейтом напрямую как с массивом
      // state.push(...payload)

      // в новой редакции используем метод upsertMany, который принимает массив объектов и обновляет соотв. объекты в entities
      notificationsAdapter.upsertMany(state, payload)

      // так как нам в рамках этого редьюсера нужно у всех объектов изменить поле, то это удобно делать методом массива,
      // но state больше не массив, поэтому получаем из объекта объектов ({entities: {},{} и т.д.}) массив объектов
      // с помощью Object.values()
      Object.values(state).forEach((notification) => {
        // отметить все уведомления как новые, если они не прочитаны
        notification.isNew = !notification.read
      })
      // сортируем наши уведомления по дате: свежие - в начале списка (старая редакция, теперь здесь сортировка не нужна,
      // так как она происходит в другом месте - в функции sortComparer адаптера)
      // state.sort((a, b) => b.date.localeCompare(a.date))
    },
  },
})

export default notificationsSlice.reducer

export const { allNotificationsRead } = notificationsSlice.actions

// селектор в старой (до нормализации) редакции
// export const selectAllNotifications = (state) => state.notifications

// новая редакция
export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors((state) => state.notifications)
