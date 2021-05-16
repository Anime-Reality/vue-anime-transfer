import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import store from '@/store'
import axios from 'axios'

// Create module later in your code (it will register itself automatically)
// In the decorator we pass the store object into which module is injected
// NOTE: When you set dynamic true, make sure you give module a name
@Module({ dynamic: true, store: store, name: 'demo', namespace: true })
export default class Demo extends VuexModule {
    img: any = null

    @Mutation
    saveImage(img: string) {
        this.img = img
    }

    get formData() {
        const formData = new FormData()
        formData.append('file', this.img)
        return formData
    }


    @Action
    async uploadImage() {
        return axios.post(
            "https://animetransfer-cecc2q6t6a-as.a.run.app/file/upload/",
            // "http://localhost:8000/file/upload/",
            this.formData,
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
