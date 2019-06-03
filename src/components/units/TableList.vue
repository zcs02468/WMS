<template>
    <table cellspacing="0" cellpadding="0" border="0" width="100%">
        <thead>
            <tr>
                <th v-for="item in titles">
                    <div></div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in datas">
                <td></td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        titles: Array,
        datas: Array,
    }
}
</script>


<style lang="less" scoped>

</style>

