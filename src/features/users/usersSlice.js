import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'

// для нормализации слайса создадим сначала сам адаптер, чтобы можно было у него "дёргать" разные методы
const usersAdapter = createEntityAdapter()
// так как слайс довольно простой, то можно при создании initialState дополнительно в getInitialState ничего не передавать
// и в итоге получим объект {ids: [], entities: {}}
const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    // метод адаптера setAll полностью перезаписывает всех пользователей
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  },
})

export default usersSlice.reducer

export const { selectById: selectUserById, selectAll: selectAllUsers } =
  // и обязательно не забываем передавать в getSelectors инлайново функцию, которая вернёт путь к локальному слайсу
  usersAdapter.getSelectors((state) => state.users)

// старая редакция (до нормализации) селекторов
// export const selectAllUsers = (state) => state.users
// export const selectUserById = (state, userId) =>
//   state.users.find((user) => user.id === userId)
