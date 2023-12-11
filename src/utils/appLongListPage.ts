import { Toast } from "vant";
import { onMounted, ref, Ref, reactive, UnwrapNestedRefs } from "vue-demi";
interface IndexType {
    [key: string]: any;
}
interface ListConfig {
    loading: boolean;
    finished: boolean;
    offset: number;
    finishedtext: string;
    startCurrent: 0 | 1;
    isRefresh: boolean;
    pullDistance: number;
}
type InitParams<A> = () => A;
type DoRequest<B extends IndexType, P> = (query: B) => Promise<P>;
type AfterRequest<P, AP = P> = (data: P[]) => AP[];
type GetListConfig<KF extends keyof ListConfig> = () => Required<
    Pick<Partial<ListConfig>, KF>
>;
// Q:query R:result D:DataItem AD：afterDataItem
export { ListConfig, IndexType };

export const appListPage = <
    Q extends IndexType,
    R,
    D extends IndexType,
    AD = D,
    C extends keyof ListConfig = keyof ListConfig
>(
    params: {
        initParams: InitParams<Q>;
        doRequest: DoRequest<Q, R>;
        afterRequest?: AfterRequest<D, AD>;
        catch?: (e: any) => any;
        listConfig?: GetListConfig<C>;
        refreshing?: () => void;
    },
    // 接口返回结果是否符合restful规范，{data, message, result}
    restful: boolean = false
) => {
    // 参数——>响应式查询参数
    const query = ref(params.initParams());
    const listConfig = ref<ListConfig>({
        loading: false,
        finished: false,
        offset: 30,
        pullDistance: 30,
        finishedtext: "没有更多了",
        startCurrent: 1,
        isRefresh: false,
    });
    const listData = ref<AD[]>([]);
    // 初始化数据
    const init = () => {
        if (params.listConfig) {
            listConfig.value = updatePropertyValue(
                listConfig.value,
                params.listConfig()
            );
        }
        if (params.refreshing) {
            refreshing = params.refreshing;
        }
        query.value = params.initParams();
    };
    // 数据加载
    async function loadData() {
        try {
            // 结果处理
            listConfig.value.loading = true;
            // 数据  页码总数 或者 页大小/数据总数
            // 当前页 current, pageNum,总页数 totalPage, pages,
            const obj: any = {};
            let {
                list, //数据
                records, //数据
                content, //数据

                total, //总数
                totalRecord, //总数
                numberOfElements, //总数

                size, //页面大小
                pageSize, //页面大小

                number, //当前页码
                page, //当前页码
                pageNo, //当前页码
                current, //当前页码
                pageNum, //当前页码
            } = await Promise.resolve(obj);
            // 接口符合restful 规范，解构返回值
            if (restful) {
                let { data, message, result } = (await params.doRequest(
                    query.value
                )) as any;
                if (result == "success") {
                    list = data.list;
                    records = data.countAll;
                    size = query.value.pagesize;
                    current = query.value.pagenumber;
                }
            }
            if (!restful) {
                let res = (await params.doRequest(query.value)) as any;
                list = res.list;
                records = res.records;
                total = res.total;
                totalRecord = res.totalRecord;
                size = res.size;
                pageSize = res.pageSize;
                current = res.current;
                pageNum = res.pageNum;
            }
            // let {
            //     list, //数据
            //     records, //数据
            //     content, //数据

            //     total, //总数
            //     totalRecord, //总数
            //     numberOfElements, //总数

            //     size, //页面大小
            //     pageSize, //页面大小

            //     number, //当前页码
            //     page, //当前页码
            //     pageNo, //当前页码
            //     current, //当前页码
            //     pageNum, //当前页码
            // } = (await params.doRequest(query.value)) as any;
            // 没有分页 -- 根据后端传回的情况调整判断条件
            if (
                current == undefined &&
                pageNum == undefined &&
                page == undefined &&
                number == undefined
            ) {
                // 不再刷新加载
                listConfig.value.loading = false;
                listConfig.value.finished = true;
            } else {
                //分页
                let pageTotal = Math.ceil(
                    (total
                        ? total
                        : totalRecord
                        ? totalRecord
                        : numberOfElements) / (size ? size : pageSize)
                );
                // 当初始页码为0的时候，current ? current : pageNum 会在current == 0 的时候判断错误
                let pageCurrent =
                    current !== undefined
                        ? current
                        : pageNum !== undefined
                        ? pageNum
                        : page !== undefined
                        ? page
                        : number !== undefined
                        ? number
                        : pageNo;
                let pageData =
                    list !== undefined
                        ? list
                        : records !== undefined
                        ? records
                        : content;
                //可能请求并未返回数据
                // 数据存在
                if (pageData?.length) {
                    listData.value = listData.value.concat(
                        params.afterRequest
                            ? params.afterRequest(pageData)
                            : pageData
                    );
                    // 不知道是哪种参数,全部当前页++
                    // 当初始页码为0的时候，xxx&&xxx++ 会在xxx == 0 的时候判断错误
                    query.value.pageNo !== undefined && query.value.pageNo++;
                    query.value.pageNum !== undefined && query.value.pageNum++;
                    query.value.current !== undefined && query.value.current++;
                    query.value.page !== undefined && query.value.page++;
                    query.value.curr !== undefined && query.value.curr++;
                    //
                    listConfig.value.loading = false;
                    // 初始页码不同，判断结束条件不同
                    if (listConfig.value.startCurrent == 1) {
                        pageCurrent >= (pageTotal as number) &&
                            (listConfig.value.finished = true);
                    }

                    if (listConfig.value.startCurrent == 0) {
                        pageCurrent >= ((pageTotal - 1) as number) &&
                            (listConfig.value.finished = true);
                    }
                } else {
                    //数据不存在
                    listConfig.value.loading = false;
                    listConfig.value.finished = true;
                }
            }
        } catch (e) {
            if (params.catch) {
                params.catch(e);
            } else {
                listConfig.value.loading = false;
                listConfig.value.finished = true;
                // Toast({
                //     message: "请求数据出错,请联系管理员",
                // });
            }
        }
    }
    // 搜索数据
    function searchData() {
        // 不知道传入参数是那种
        // 页码重置初始值
        query.value.pageNo !== undefined &&
            (query.value.pageNo = listConfig.value.startCurrent);
        query.value.pageNum !== undefined &&
            (query.value.pageNum = listConfig.value.startCurrent);
        query.value.current !== undefined &&
            (query.value.current = listConfig.value.startCurrent);
        query.value.page !== undefined &&
            (query.value.page = listConfig.value.startCurrent);
        query.value.current !== undefined &&
            (query.value.current = listConfig.value.startCurrent);
        query.value.curr !== undefined &&
            (query.value.curr = listConfig.value.startCurrent);
        // 数据置空
        listData.value = [];
        listConfig.value.finished = false;
        loadData();
    }
    // 下拉刷新
    let refreshing = () => {
        // 初始化参数
        // query 初始化
        query.value = params.initParams();
        // 不知道传入参数是那种,全部判断
        query.value.pageNo !== undefined &&
            (query.value.pageNo = listConfig.value.startCurrent);
        query.value.pageNum !== undefined &&
            (query.value.pageNum = listConfig.value.startCurrent);
        query.value.current !== undefined &&
            (query.value.current = listConfig.value.startCurrent);
        query.value.page !== undefined &&
            (query.value.page = listConfig.value.startCurrent);
        query.value.curr !== undefined &&
            (query.value.curr = listConfig.value.startCurrent);
        // 数据初始化
        listData.value = [];
        // 加载动画初始化
        listConfig.value.finished = false;
        listConfig.value.loading = false;
        loadData(); // 重新发送请求
        listConfig.value.isRefresh = false; // 停止刷新
    };
    onMounted(() => {
        init();
        loadData();
    });
    // 初始化
    // init();
    // loadData();
    return {
        query, //分页查询参数
        loadData, //加载数据
        searchData, //搜索数据
        refreshing, //下拉刷新
        listData, //列表数据
        listConfig, //列表配置
        init, //参数初始化
    };
};
// 更新列表配置默认值
function updatePropertyValue<T, KF extends keyof T>(
    defaultConfig: T,
    newConfig: Required<Pick<Partial<T>, KF>>
): T {
    return { ...defaultConfig, ...newConfig };
}
