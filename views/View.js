
class View {
    static listall (response, listItems){
        
        const totalPages = listItems.length;
        response.render('products', {title: 'Todos os produtos', produtos: listItems, totalPages})
        
    }

    static listById (response, product){
        
        response.render('productDetail', {title: 'Detalhes do produto', product: product})
        
    }

    static insertView (response, messagem){
        response.render('index', {title: 'Novo produto', message: messagem})
    };

    static updateView (response, messagem){
        response.render('index', {title: 'Produto atualizado', message: messagem})
    }

    static deleteView (response, menssagem){
        response.render('index', {title: 'Produto deletado',
        message: menssagem})
    };
}

module.exports = View;