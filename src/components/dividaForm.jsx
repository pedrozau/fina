
const DividaForm = () => {

    return (
        <>
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">

              <form className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full mx-auto lg:mx-0">
              <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Gerenciar Dívidas</h1>
                  <div className="mb-6">
                      <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="debtName">
                          Nome da Dívida
                      </label>
                      <input
                          id="debtName"
                          type="text"
                          className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out"
                          placeholder="Ex: Empréstimo Banco" />
                  </div>

                  <div className="mb-6">
                      <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="amount">
                          Valor
                      </label>
                      <input
                          id="amount"
                          type="number"
                          className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out"
                          placeholder="Ex: 1000" />
                  </div>

                  <div className="mb-6">
                      <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="dueDate">
                          Data de Vencimento
                      </label>
                      <input
                          id="dueDate"
                          type="date"
                          className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out" />
                  </div>

                  <div className="mb-6">
                      <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="description">
                          Descrição
                      </label>
                      <textarea
                          id="description"
                          className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out"
                          placeholder="Escreva uma breve descrição..."
                          rows="4"
                      ></textarea>
                  </div>

                  <div className="flex items-center justify-between">
                      <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 w-full transition duration-300 ease-in-out transform hover:scale-105"
                      >
                          Salvar Dívida
                      </button>
                  </div>
              </form>
          </div>
      
        </>
    )
         
}


export default DividaForm