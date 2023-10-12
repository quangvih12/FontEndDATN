export default class KhuyenMaiService {
    getKhuyenMai() {
        return fetch('demo/data/khuyenmai.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getTenKhuyenMai() {
        return fetch('demo/data/khuyenmai.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
