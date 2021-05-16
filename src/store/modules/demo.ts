import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import store from '@/store'
import axios from 'axios'
import b64toBlob from '@/utils/b64toblob'

// Create module later in your code (it will register itself automatically)
// In the decorator we pass the store object into which module is injected
// NOTE: When you set dynamic true, make sure you give module a name
@Module({ dynamic: true, store: store, name: 'demo', namespace: true })
export default class Demo extends VuexModule {

    @Action
    async uploadImage(formData: any) {
        return axios.post(
            "https://animetransfer-cecc2q6t6a-as.a.run.app/file/upload/",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    }

    @Action
    async retrieveUploadedFile(filename: string) {
        axios.get(
            `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${filename}`
        );
    }
}
